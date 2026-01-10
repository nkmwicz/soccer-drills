import { atom } from "jotai";

export const usersState = atom<{ id: string; name: string }[]>([]);

export const activeUserState = atom<{ id: string; name: string }>({
  id: "",
  name: "",
});

export const isChooseUserModalOpenState = atom<boolean>(false);
export const isAddingUserState = atom<boolean>(false);

export const userDrillState = atom<
  { id: string; userId: string; drillId: string; dates: Date[] }[]
>([]);

export const pastDrillsState = atom<{ drillId: number; dates: Date[] }[]>([]);

export const drillTypes = [
  "Two-Cone Mastery",
  "One-Cone Mastery",
  "Cone Dribbling",
  "Agility",
  "Wall Drills",
  "Rest",
];

// Base Drills
export const croqueta = {
  id: 0,
  title: "La Croquetta",
  description:
    "Start to the right of the cone, pull the ball back, use the inside of your right foot to push the ball to your left foot as part of a side shuffle, the left foot pushes the ball forward to the left of the cone, repeat.",
  type: "One-Cone Mastery",
};

export const fullArsenal = {
  id: 1,
  title: "The Full Arsenal Circuit",
  description:
    "Start on the right cone, touch forward, Cuyff, two-footed V-Turn, inside V-Turn, La Croquetta to left cone, start over (the cruqueta should push the ball forward beside the left cone).",
  type: "Two-Cone Mastery",
};

export const cruyffCroqueta = {
  id: 2,
  title: "Cruyff to La Croquetta",
  description:
    "Start on the right cone, touch forward, Cruyff, stop the ball, La Croquetta to left cone, repeat.",
  type: "Two-Cone Mastery",
};

export const restDrill = {
  id: -1,
  title: "Rest",
  description: "Recovery period",
  type: "Rest",
};

export const allDrillsState = atom([
  croqueta,
  fullArsenal,
  cruyffCroqueta,
  restDrill,
]);

export const selectedDrilltype = atom<string>("");

export const drillsState = atom<
  { id: number; title: string; description: string; type: string }[]
>([fullArsenal, cruyffCroqueta]);

// Routine Types
interface RoutineStep {
  drillId: number;
  minutes: number;
}

interface Routine {
  id: string;
  name: string;
  description?: string;
  duration: number; // Total duration in minutes (10, 20, 30, etc.)
  steps: RoutineStep[];
}

// Routines organized by duration
export const routinesState = atom<Routine[]>([
  // 10-minute routines
  {
    id: "10min-basic",
    name: "Quick Warmup",
    description: "Fast-paced basic skills",
    duration: 10,
    steps: [
      { drillId: 0, minutes: 3 },
      { drillId: -1, minutes: 1 },
      { drillId: 1, minutes: 3 },
      { drillId: -1, minutes: 1 },
      { drillId: 2, minutes: 2 },
    ],
  },
  {
    id: "10min-stamina",
    name: "Stamina Builder",
    description: "High intensity with minimal rest",
    duration: 10,
    steps: [
      { drillId: 1, minutes: 4 },
      { drillId: -1, minutes: 1 },
      { drillId: 0, minutes: 5 },
    ],
  },

  // 20-minute routines
  {
    id: "20min-balanced",
    name: "Balanced Training",
    description: "Mix of all core drills",
    duration: 20,
    steps: [
      { drillId: 0, minutes: 5 },
      { drillId: -1, minutes: 2 },
      { drillId: 1, minutes: 5 },
      { drillId: -1, minutes: 2 },
      { drillId: 2, minutes: 4 },
      { drillId: -1, minutes: 2 },
    ],
  },
  {
    id: "20min-endurance",
    name: "Endurance Focus",
    description: "Longer intervals with short rests",
    duration: 20,
    steps: [
      { drillId: 1, minutes: 7 },
      { drillId: -1, minutes: 2 },
      { drillId: 0, minutes: 7 },
      { drillId: -1, minutes: 2 },
      { drillId: 2, minutes: 2 },
    ],
  },

  // 30-minute routines
  {
    id: "30min-complete",
    name: "Complete Workout",
    description: "Full training session",
    duration: 30,
    steps: [
      { drillId: 0, minutes: 6 },
      { drillId: -1, minutes: 2 },
      { drillId: 1, minutes: 6 },
      { drillId: -1, minutes: 2 },
      { drillId: 2, minutes: 6 },
      { drillId: -1, minutes: 2 },
      { drillId: 0, minutes: 4 },
      { drillId: -1, minutes: 2 },
    ],
  },
  {
    id: "30min-advanced",
    name: "Advanced Circuit",
    description: "Challenging intervals for experienced players",
    duration: 30,
    steps: [
      { drillId: 1, minutes: 10 },
      { drillId: -1, minutes: 3 },
      { drillId: 0, minutes: 8 },
      { drillId: -1, minutes: 3 },
      { drillId: 2, minutes: 6 },
    ],
  },
]);

// Derived atom: Get routines by duration
export const getRoutinesByDurationState = atom((get) => (duration: number) => {
  const routines = get(routinesState);
  return routines.filter((r) => r.duration === duration);
});

// Derived atom: Get routine with full drill details
export const getRoutineWithDrillsState = atom(
  (get) => (routineId: string | null) => {
    const routines = get(routinesState);
    const drills = get(allDrillsState);

    if (!routineId) return null;
    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return null;

    return {
      ...routine,
      steps: routine.steps.map((step) => ({
        drill: drills.find((d) => d.id === step.drillId)!,
        minutes: step.minutes,
      })),
    };
  }
);

// Derived atom: Get all unique durations
export const availableDurationsState = atom((get) => {
  const routines = get(routinesState);
  const durations = [...new Set(routines.map((r) => r.duration))];
  return durations.sort((a, b) => a - b);
});

// Active Routine Execution State
export const chosenRoutineIdState = atom<string | null>(null);
