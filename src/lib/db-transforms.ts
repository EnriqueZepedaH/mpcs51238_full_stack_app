import { Workout, Exercise, WorkoutSet, Routine, RoutineExercise, SavedExercise } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function dbWorkoutToWorkout(row: any): Workout {
  const exercises: Exercise[] = (row.workout_exercises || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((ex: any): Exercise => ({
      id: ex.id,
      name: ex.name,
      notes: ex.notes || "",
      muscleGroup: ex.muscle_group || undefined,
      libraryExerciseId: ex.library_exercise_id || undefined,
      sets: (ex.workout_sets || [])
        .sort((a: any, b: any) => a.position - b.position)
        .map((s: any): WorkoutSet => ({
          id: s.id,
          reps: s.reps,
          weight: Number(s.weight),
        })),
    }));

  return {
    id: row.id,
    date: row.date,
    title: row.title,
    exercises,
    createdAt: row.created_at,
  };
}

export function dbRoutineToRoutine(row: any): Routine {
  const exercises: RoutineExercise[] = (row.routine_exercises || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((ex: any): RoutineExercise => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.muscle_group || undefined,
      libraryExerciseId: ex.library_exercise_id || undefined,
      targetSets: ex.target_sets,
      targetReps: ex.target_reps,
    }));

  return {
    id: row.id,
    name: row.name,
    exercises,
    createdAt: row.created_at,
  };
}

export function dbSavedExerciseToSavedExercise(row: any): SavedExercise {
  return {
    id: row.id,
    apiExerciseId: row.api_exercise_id,
    name: row.name,
    description: row.description || "",
    muscleGroup: row.muscle_group,
    muscles: row.muscles || [],
    equipment: row.equipment || [],
    imageUrl: row.image_url,
    savedAt: row.saved_at,
  };
}
