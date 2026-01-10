import { useState } from "react";
import { Template } from "../components/Template";
import { DrillSelection } from "../components/screens/DrillSelection";
import { DrillTimerScreen } from "../components/screens/DrillTimerScreen";

type DrillScreen = "selection" | "timer";

export function Drills() {
  const [currentScreen, setCurrentScreen] = useState<DrillScreen>("selection");

  const handleRoutineSelect = () => {
    setCurrentScreen("timer");
  };

  const handleComplete = () => {
    setCurrentScreen("selection");
  };

  const handleExit = () => {
    setCurrentScreen("selection");
  };

  return (
    <Template>
      {currentScreen === "selection" && (
        <DrillSelection onRoutineSelect={handleRoutineSelect} />
      )}
      {currentScreen === "timer" && (
        <DrillTimerScreen onComplete={handleComplete} onExit={handleExit} />
      )}
    </Template>
  );
}
