import { LibraryExercise, MuscleGroup } from "./types";

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Calves",
  "Glutes",
  "Core",
  "Full Body",
];

export const exerciseLibrary: LibraryExercise[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "Chest" },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", muscleGroup: "Chest" },
  { id: "dumbbell-flyes", name: "Dumbbell Flyes", muscleGroup: "Chest" },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "Chest" },
  { id: "push-ups", name: "Push-ups", muscleGroup: "Chest" },

  // Back
  { id: "deadlift", name: "Deadlift", muscleGroup: "Back" },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "Back" },
  { id: "pull-ups", name: "Pull-ups", muscleGroup: "Back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Back" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "Back" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "Back" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "Shoulders" },
  { id: "front-raise", name: "Front Raise", muscleGroup: "Shoulders" },
  { id: "face-pull", name: "Face Pull", muscleGroup: "Shoulders" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "Shoulders" },

  // Biceps
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "Biceps" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "Biceps" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "Biceps" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "Biceps" },

  // Triceps
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "Triceps" },
  { id: "skull-crushers", name: "Skull Crushers", muscleGroup: "Triceps" },
  { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", muscleGroup: "Triceps" },
  { id: "close-grip-bench-press", name: "Close-Grip Bench Press", muscleGroup: "Triceps" },

  // Legs
  { id: "squat", name: "Squat", muscleGroup: "Legs" },
  { id: "front-squat", name: "Front Squat", muscleGroup: "Legs" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "Legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "Legs" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "Legs" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "Legs" },
  { id: "calf-raise", name: "Calf Raise", muscleGroup: "Calves" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "Legs" },

  // Glutes
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "Glutes" },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "Glutes" },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "Glutes" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscleGroup: "Glutes" },

  // Core
  { id: "plank", name: "Plank", muscleGroup: "Core" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "Core" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "Core" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "Core" },

  // Full Body
  { id: "clean-and-press", name: "Clean and Press", muscleGroup: "Full Body" },
  { id: "thruster", name: "Thruster", muscleGroup: "Full Body" },
  { id: "turkish-get-up", name: "Turkish Get-Up", muscleGroup: "Full Body" },
  { id: "farmers-walk", name: "Farmer's Walk", muscleGroup: "Full Body" },
];

export function searchExercises(
  query: string,
  muscleGroup?: MuscleGroup
): LibraryExercise[] {
  let results = exerciseLibrary;

  if (muscleGroup) {
    results = results.filter((e) => e.muscleGroup === muscleGroup);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((e) => e.name.toLowerCase().includes(q));
  }

  return results;
}
