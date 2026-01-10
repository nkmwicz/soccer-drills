export interface Drill {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
}

export interface DrillRoutine {
  id: string;
  name: string;
}

export interface DrillSession {
  id: string;
  userId: string;
  drillId: string;
  datetime: Date;
}
