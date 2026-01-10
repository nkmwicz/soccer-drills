import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router";
import {
  activeRoutineState,
  currentActiveRoutineState,
  getRoutineWithDrillsState,
} from "../utils/globalState";
import { Template } from "../components/Template";

export function DrillTimer() {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const [active, setActive] = useAtom(activeRoutineState);
  const currentRoutine = useAtomValue(currentActiveRoutineState);
  const getRoutine = useAtomValue(getRoutineWithDrillsState);

  // Initialize routine on mount
  useEffect(() => {
    if (routineId && !active.routineId) {
      const routine = getRoutine(routineId);
      if (routine) {
        setActive({
          routineId,
          currentStepIndex: 0,
          isRunning: false,
          isPaused: false,
          secondsRemaining: routine.steps[0].minutes * 60,
          totalSecondsElapsed: 0,
        });
      }
    }
  }, [routineId]);

  // Timer logic
  useEffect(() => {
    if (!active.isRunning || active.isPaused) return;

    const interval = setInterval(() => {
      setActive((prev) => {
        if (prev.secondsRemaining <= 1) {
          // Move to next step
          const routine = getRoutine(prev.routineId!);
          if (!routine) return prev;

          const nextIndex = prev.currentStepIndex + 1;

          if (nextIndex >= routine.steps.length) {
            // Routine complete!
            return {
              ...prev,
              isRunning: false,
              secondsRemaining: 0,
            };
          }

          return {
            ...prev,
            currentStepIndex: nextIndex,
            secondsRemaining: routine.steps[nextIndex].minutes * 60,
            totalSecondsElapsed: prev.totalSecondsElapsed + 1,
          };
        }

        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
          totalSecondsElapsed: prev.totalSecondsElapsed + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active.isRunning, active.isPaused]);

  const startRoutine = () => {
    setActive((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const pauseRoutine = () => {
    setActive((prev) => ({ ...prev, isPaused: true }));
  };

  const resumeRoutine = () => {
    setActive((prev) => ({ ...prev, isPaused: false }));
  };

  const skipStep = () => {
    const routine = getRoutine(active.routineId!);
    if (!routine) return;

    const nextIndex = active.currentStepIndex + 1;
    if (nextIndex >= routine.steps.length) {
      setActive((prev) => ({ ...prev, isRunning: false }));
      return;
    }

    setActive((prev) => ({
      ...prev,
      currentStepIndex: nextIndex,
      secondsRemaining: routine.steps[nextIndex].minutes * 60,
    }));
  };

  const exitRoutine = () => {
    setActive({
      routineId: null,
      currentStepIndex: 0,
      isRunning: false,
      isPaused: false,
      secondsRemaining: 0,
      totalSecondsElapsed: 0,
    });
    navigate("/routines");
  };

  if (!currentRoutine) {
    return (
      <Template>
        <div>Loading routine...</div>
      </Template>
    );
  }

  const {
    routine,
    currentStep,
    currentStepIndex,
    totalSteps,
    secondsRemaining,
    isRunning,
    isPaused,
    progress,
  } = currentRoutine;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isComplete =
    !isRunning && currentStepIndex === totalSteps - 1 && secondsRemaining === 0;

  return (
    <Template>
      <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{routine.name}</h1>
          <p className="text-gray-600">{routine.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Current Drill */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
          <h2 className="text-4xl font-bold">{currentStep.drill.title}</h2>
          <p className="text-gray-600">{currentStep.drill.description}</p>

          {/* Timer Display */}
          <div className="text-8xl font-bold text-primary my-8">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>

          {isComplete ? (
            <div className="space-y-4">
              <div className="text-2xl font-bold text-green-600">
                🎉 Routine Complete!
              </div>
              <button
                onClick={exitRoutine}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-80"
              >
                Finish
              </button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <button
                  onClick={startRoutine}
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-80"
                >
                  Start
                </button>
              ) : isPaused ? (
                <button
                  onClick={resumeRoutine}
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-80"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={pauseRoutine}
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-80"
                >
                  Pause
                </button>
              )}
              <button
                onClick={skipStep}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:opacity-80"
              >
                Skip Step
              </button>
              <button
                onClick={exitRoutine}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:opacity-80"
              >
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Steps */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Upcoming Steps:</h3>
          <div className="space-y-2">
            {routine.steps
              .slice(currentStepIndex + 1, currentStepIndex + 4)
              .map((step, idx) => (
                <div key={idx} className="text-sm text-gray-600">
                  {step.drill.title} - {step.minutes} min
                </div>
              ))}
          </div>
        </div>
      </div>
    </Template>
  );
}
