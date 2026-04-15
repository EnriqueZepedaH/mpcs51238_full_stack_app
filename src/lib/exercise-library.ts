import {
  ComboboxExercise,
  LibraryExercise,
  MuscleGroup,
  SavedExercise,
} from "./types";

export const MUSCLE_HIERARCHY: Record<string, Record<string, MuscleGroup[]>> = {
  "Upper Body": {
    Chest: ["Chest"],
    Back: ["Traps", "Lats", "Lower Back"],
    Shoulders: ["Shoulders"],
    Arms: ["Biceps", "Triceps", "Forearms"],
  },
  "Lower Body": {
    Legs: ["Quads", "Hamstrings", "Calves"],
    Glutes: ["Glutes"],
  },
  Core: {
    Core: ["Core"],
  },
};

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest",
  "Traps",
  "Lats",
  "Lower Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quads",
  "Hamstrings",
  "Calves",
  "Glutes",
  "Core",
  "Full Body",
];

// Mid-level category labels for filter pills
export const MID_LEVEL_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Glutes",
  "Core",
] as const;

export function getMuscleGroupsIn(category: string): MuscleGroup[] {
  // Check if it's a top-level key
  if (category in MUSCLE_HIERARCHY) {
    const mid = MUSCLE_HIERARCHY[category];
    return Object.values(mid).flat();
  }
  // Check if it's a mid-level key
  for (const top of Object.values(MUSCLE_HIERARCHY)) {
    if (category in top) {
      return top[category];
    }
  }
  // Check if it's already a leaf
  if (ALL_MUSCLE_GROUPS.includes(category as MuscleGroup)) {
    return [category as MuscleGroup];
  }
  return [];
}

export const exerciseLibrary: LibraryExercise[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "Chest" },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", muscleGroup: "Chest" },
  { id: "dumbbell-flyes", name: "Dumbbell Flyes", muscleGroup: "Chest" },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "Chest" },
  { id: "push-ups", name: "Push-ups", muscleGroup: "Chest" },

  // Back — Traps
  { id: "face-pull", name: "Face Pull", muscleGroup: "Traps" },

  // Back — Lats
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "Lats" },
  { id: "pull-ups", name: "Pull-ups", muscleGroup: "Lats" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Lats" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "Lats" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "Lats" },

  // Back — Lower Back
  { id: "deadlift", name: "Deadlift", muscleGroup: "Lower Back" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "Shoulders" },
  { id: "front-raise", name: "Front Raise", muscleGroup: "Shoulders" },
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

  // Legs — Quads
  { id: "squat", name: "Squat", muscleGroup: "Quads" },
  { id: "front-squat", name: "Front Squat", muscleGroup: "Quads" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "Quads" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "Quads" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "Quads" },

  // Legs — Hamstrings
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "Hamstrings" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "Hamstrings" },

  // Legs — Calves
  { id: "calf-raise", name: "Calf Raise", muscleGroup: "Calves" },

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
  category?: string
): LibraryExercise[] {
  let results = exerciseLibrary;

  if (category) {
    const leafGroups = getMuscleGroupsIn(category);
    if (leafGroups.length > 0) {
      results = results.filter((e) => leafGroups.includes(e.muscleGroup));
    }
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((e) => e.name.toLowerCase().includes(q));
  }

  return results;
}

/**
 * Maps a wger category string (e.g. "Arms", "Abs") to one of our MuscleGroup
 * leaf values. wger's categories are coarser than ours, so this is best-effort:
 * we route to the most representative leaf and fall back to "Full Body" for
 * anything we don't recognize.
 */
export function wgerCategoryToMuscleGroup(category: string | null | undefined): MuscleGroup {
  if (!category) return "Full Body";

  // Already a leaf group? Use it as-is.
  if (ALL_MUSCLE_GROUPS.includes(category as MuscleGroup)) {
    return category as MuscleGroup;
  }

  // wger uses common gym terms like "Abs" — and exercise muscle names like
  // "Biceps brachii" — neither matches our enum exactly.
  const lower = category.toLowerCase();
  if (lower.includes("chest") || lower.includes("pectoral")) return "Chest";
  if (lower.includes("back") && lower.includes("lower")) return "Lower Back";
  if (lower.includes("trap")) return "Traps";
  if (lower.includes("lat") || lower === "back") return "Lats";
  if (lower.includes("shoulder") || lower.includes("delt")) return "Shoulders";
  if (lower.includes("bicep")) return "Biceps";
  if (lower.includes("tricep")) return "Triceps";
  if (lower.includes("forearm")) return "Forearms";
  if (lower === "arms") return "Biceps"; // wger's "Arms" most often = biceps/triceps
  if (lower.includes("quad")) return "Quads";
  if (lower.includes("hamstring")) return "Hamstrings";
  if (lower.includes("calf") || lower.includes("calves")) return "Calves";
  if (lower.includes("glute")) return "Glutes";
  if (lower.includes("ab") || lower.includes("core") || lower.includes("oblique")) return "Core";
  if (lower.includes("leg")) return "Quads";

  return "Full Body";
}

/**
 * Returns combined search results from the static library AND the user's
 * saved wger exercises. Library wins on case-insensitive name collisions
 * (more reliable muscle group mapping). Library results come first, then
 * saved results — the combobox renders them under separate section headers.
 */
export function searchAllExercises(
  query: string,
  savedExercises: SavedExercise[]
): { library: ComboboxExercise[]; saved: ComboboxExercise[] } {
  const library: ComboboxExercise[] = searchExercises(query).map((ex) => ({
    id: ex.id,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    source: "library",
  }));

  const libraryNames = new Set(library.map((e) => e.name.toLowerCase()));
  const q = query.trim().toLowerCase();

  const saved: ComboboxExercise[] = savedExercises
    .filter((ex) => {
      if (libraryNames.has(ex.name.toLowerCase())) return false;
      if (!q) return true;
      return ex.name.toLowerCase().includes(q);
    })
    .map((ex) => ({
      id: `saved-${ex.apiExerciseId}`,
      name: ex.name,
      muscleGroup: wgerCategoryToMuscleGroup(ex.muscleGroup),
      source: "saved",
    }));

  return { library, saved };
}
