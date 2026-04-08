export type MuscleGroup =
  | "Chest"
  | "Traps"
  | "Lats"
  | "Lower Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Quads"
  | "Hamstrings"
  | "Calves"
  | "Glutes"
  | "Core"
  | "Full Body";

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
}

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
  muscleGroup?: MuscleGroup;
  libraryExerciseId?: string;
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface RoutineExercise {
  id: string;
  name: string;
  muscleGroup?: MuscleGroup;
  libraryExerciseId?: string;
  targetSets: number;
  targetReps: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}
