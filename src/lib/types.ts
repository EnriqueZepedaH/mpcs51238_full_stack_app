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

// External API (wger) types

export interface WgerSearchSuggestion {
  value: string;
  data: {
    id: number;
    base_id: number;
    name: string;
    category: string;
    image: string | null;
    image_thumbnail: string | null;
  };
}

export interface WgerMuscle {
  id: number;
  name: string;
  name_en: string;
  is_front: boolean;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

export interface WgerImage {
  image: string;
  is_main: boolean;
}

export interface WgerExerciseDetail {
  id: number;
  name: string;
  description: string;
  category: string;
  muscles: WgerMuscle[];
  muscles_secondary: WgerMuscle[];
  equipment: WgerEquipment[];
  images: WgerImage[];
}

export interface SavedExercise {
  id: string;
  apiExerciseId: number;
  name: string;
  description: string;
  muscleGroup: string | null;
  muscles: WgerMuscle[];
  equipment: WgerEquipment[];
  imageUrl: string | null;
  savedAt: string;
}
