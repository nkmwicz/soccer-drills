import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  getRoutineWithDrillsState,
  activeUserState,
  chosenRoutineIdState,
} from "../../utils/globalState";
import { saveDrillSession } from "../../utils/storage";
import { Button } from "../buttons/Button";
import { useTimer } from "react-timer-hook";

interface DrillTimerScreenProps {
  onComplete: () => void;
  onExit: () => void;
}

export function DrillTimerScreen() {
  const chosenRoutineId = useAtomValue(chosenRoutineIdState);
  const [activeUser] = useAtom(activeUserState);
  const getRoutine = useAtomValue(getRoutineWithDrillsState);
  const activeRoutine = getRoutine(chosenRoutineId);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoStart, setIsAutoStart] = useState(false);

  interface DrillTypes {
    id: number;
    title: string;
    description: string;
    type: string;
  }
  interface StepsTypes {
    drill: DrillTypes;
    minutes: number;
  }
  const [localSteps, setLocalSteps] = useState<StepsTypes[]>(
    activeRoutine?.steps || []
  );

  // Calculate expiry time based on current seconds remaining
  const getExpiryTimestamp = (seconds: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + seconds);
    return time;
  };

  const handleRoutineComplete = async () => {
    // Save each drill session to IndexedDB
    const now = new Date();

    if (!activeRoutine) return;
    console.log(
      "Routine complete, saving drill session",
      activeUser,
      activeRoutine
    );
    // Get all unique drill IDs from activeRoutine (excluding rest)
    await saveDrillSession(activeUser.id, activeRoutine.id.toString(), now);
    setIsComplete(true);
  };

  const handleTimerExpire = () => {
    if (!activeRoutine) return;
    // Move to next step or complete routine
    if (localSteps.length > 1) {
      setLocalSteps((prev) => prev.slice(1));
    } else {
      handleRoutineComplete();
    }
  };

  const {
    totalSeconds,
    seconds: timerSeconds,
    minutes: timerMinutes,
    isRunning: timerIsRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(
      localSteps.length > 0 ? localSteps[0].minutes * 60 : 0
    ),
    autoStart: isAutoStart,
    onExpire: () => {
      handleTimerExpire();
    },
  });
  // Countdown voice announcement
  useEffect(() => {
    if (isRunning && !isPaused && totalSeconds > 0 && totalSeconds <= 5) {
      const utterance = new SpeechSynthesisUtterance(totalSeconds.toString());
      utterance.rate = 1; // Slightly faster
      utterance.pitch = 1; // Higher pitch for urgency
      window.speechSynthesis.speak(utterance);
    }
    if (
      isRunning &&
      !isPaused &&
      totalSeconds % 60 === 0 &&
      totalSeconds > 0 &&
      totalSeconds !== localSteps[0].minutes * 60
    ) {
      const minutesLeft = totalSeconds / 60;
      const utterance = new SpeechSynthesisUtterance(
        `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} remaining`
      );
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
    // Announce drill start
    if (
      isRunning &&
      !isPaused &&
      totalSeconds &&
      localSteps[0].drill.title === "Rest" &&
      totalSeconds === localSteps[0].minutes * 60
    ) {
      const utterance = new SpeechSynthesisUtterance(
        `Rest for ${localSteps[0].minutes} minute${
          localSteps[0].minutes > 1 ? "s" : ""
        }`
      );
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
    if (
      isRunning &&
      !isPaused &&
      totalSeconds === 10 &&
      localSteps[0].drill.title === "Rest" &&
      localSteps.length > 1
    ) {
      const utterance = new SpeechSynthesisUtterance(
        `Prepare for ${localSteps[1].drill.title}`
      );
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }

    if (isComplete) {
      const utterance = new SpeechSynthesisUtterance(
        `Routine complete. Well done!`
      );
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [totalSeconds, isRunning, isPaused, localSteps, isComplete]);

  const handleStart = () => {
    start();
    setIsRunning(true);
    setIsAutoStart(true);
  };

  const handlePause = () => {
    pause();
    setIsPaused(true);
    setIsAutoStart(false);
  };

  const handleResume = () => {
    resume();
    setIsPaused(false);
    setIsAutoStart(true);
  };

  useEffect(() => {
    const step = localSteps[0];
    const minutes = step ? step.minutes : 0;
    const time = new Date();
    time.setSeconds(time.getSeconds() + minutes * 60);
    restart(time, isRunning);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSteps]);

  if (!activeRoutine) {
    return <div>Loading routine...</div>;
  }

  // Calculate progress - derived from other state, no need for useState
  const totalDrillSeconds =
    activeRoutine.steps[currentStepIndex].minutes * 60 || 0;
  const elapsedSeconds = totalDrillSeconds - totalSeconds;
  const progress =
    totalDrillSeconds > 0 ? (elapsedSeconds / totalDrillSeconds) * 100 : 0;

  // Use timer values for display
  const displayMinutes = timerMinutes;
  const displaySeconds = timerSeconds;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">{activeRoutine.name}</h1>
        <p className="text-gray-600">{activeRoutine.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 border border-black z-20">
        <div
          className="bg-primary h-4 rounded-full transition-all duration-300 z-10"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Current Drill */}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <div className="text-sm text-gray-500">
          Step {activeRoutine.steps.length + 1 - localSteps.length} of{" "}
          {activeRoutine.steps.length}
        </div>
        <h2 className="text-4xl font-bold">{localSteps[0].drill.title}</h2>
        <p className="text-gray-600">{localSteps[0].drill.description}</p>

        {/* Timer Display */}
        <div className="text-8xl font-bold text-primary my-8">
          {displayMinutes}:{displaySeconds.toString().padStart(2, "0")}
        </div>

        {isComplete ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-green-600">
              🎉 Routine Complete!
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center flex-wrap">
            {!timerIsRunning && !isPaused ? (
              <Button
                title="Start"
                onClick={handleStart}
                className="px-6 py-3"
              />
            ) : isPaused ? (
              <Button
                title="Resume"
                onClick={handleResume}
                className="px-6 py-3 bg-red-500"
              />
            ) : (
              <button
                onClick={handlePause}
                className="rounded-lg border border-black hover:bg-accent active:bg-accent cursor-pointer px-6 py-3 bg-red-400"
              >
                Pause
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Steps */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">Upcoming Steps:</h3>
        <div className="space-y-2">
          {activeRoutine.steps
            .slice(currentStepIndex + 1, currentStepIndex + 4)
            .map((step, idx) => (
              <div key={idx} className="text-sm text-gray-600">
                {step.drill.title} - {step.minutes} min
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
