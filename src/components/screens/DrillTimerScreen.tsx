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
import { time } from "console";

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
  const [progress, setProgress] = useState(0);

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
    if (currentStepIndex + 1 == activeRoutine!.steps.length) {
      handleRoutineComplete();
      return;
    }
    // Move to next step
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    // Restart timer for next step
    const nextStepMinutes = activeRoutine!.steps[nextIndex].minutes;
    console.log(
      "Starting next step for",
      nextStepMinutes,
      "minutes",
      nextIndex,
      "of",
      activeRoutine!.steps[nextIndex]
    );
    const time = new Date();
    time.setSeconds(time.getSeconds() + nextStepMinutes * 60);
    restart(time);
    start();
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
      activeRoutine ? activeRoutine.steps[currentStepIndex].minutes * 60 : 0
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
  }, [totalSeconds, isRunning, isPaused]);

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

  if (!activeRoutine) {
    return <div>Loading routine...</div>;
  }

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
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-primary h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Current Drill */}
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <div className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {activeRoutine.steps.length}
        </div>
        <h2 className="text-4xl font-bold">
          {activeRoutine.steps[currentStepIndex].drill.title}
        </h2>
        <p className="text-gray-600">
          {activeRoutine.steps[currentStepIndex].drill.description}
        </p>

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
