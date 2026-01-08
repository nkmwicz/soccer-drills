import { atom } from "jotai";

export const userNameState = atom<{ id: string; name: string }>({
  id: "",
  name: "",
});

export const pastDrillsState = atom<{ drillId: number; dates: Date[] }[]>([]);

export const drillTypes = [
  "Two-Cone Mastery",
  "One-Cone Mastery",
  "Cone Dribbling",
  "Agility",
  "Wall Drills",
];

// Drills
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

export const selectedDrilltype = atom<string>("");

export const drillsState = atom<
  { id: number; title: string; description: string; type: string }[]
>([fullArsenal, cruyffCroqueta]);
