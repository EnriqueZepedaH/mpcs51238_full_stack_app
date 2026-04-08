export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  notes: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  exercises: Exercise[];
  createdAt: string;
}
