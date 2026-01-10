import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  availableDurationsState,
  getRoutinesByDurationState,
  activeRoutineState,
  getRoutineWithDrillsState,
  chosenRoutineIdState,
} from "../../utils/globalState";

interface DrillSelectionProps {
  onRoutineSelect: (routineId: string) => void;
}

export function DrillSelection({ onRoutineSelect }: DrillSelectionProps) {
  const durations = useAtomValue(availableDurationsState);
  const getByDuration = useAtomValue(getRoutinesByDurationState);
  const getRoutine = useAtomValue(getRoutineWithDrillsState);
  const setChosenRoutineId = useSetAtom(chosenRoutineIdState);

  const handleRoutineClick = (routineId: string) => {
    const routine = getRoutine(routineId);
    if (routine) {
      setChosenRoutineId(routineId);
      onRoutineSelect(routineId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Select a Drill Routine</h1>
        <p className="text-gray-600">
          Choose a workout based on your available time
        </p>
      </div>

      {durations.map((duration) => {
        const routines = getByDuration(duration);
        return (
          <div key={duration} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2">
              {duration} Minute Routines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routines.map((routine) => {
                const fullRoutine = getRoutine(routine.id);
                const totalSteps = fullRoutine?.steps.length || 0;

                return (
                  <div
                    key={routine.id}
                    onClick={() => handleRoutineClick(routine.id)}
                    className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{routine.name}</h3>
                      <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                        {duration}m
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {routine.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{totalSteps} steps</span>
                      <span className="text-primary font-semibold">
                        Start →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
