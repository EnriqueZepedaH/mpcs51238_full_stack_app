"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "./supabase";
import {
  Workout,
  Routine,
  SavedExercise,
  CommunityFavorite,
  WgerMuscle,
  WgerEquipment,
} from "./types";
import {
  dbWorkoutToWorkout,
  dbRoutineToRoutine,
  dbSavedExerciseToSavedExercise,
} from "./db-transforms";

async function getUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

// ── Workouts ──

export async function getWorkouts(): Promise<Workout[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, workout_sets(*))")
    .order("date", { ascending: false });

  if (error) throw error;
  return (data || []).map(dbWorkoutToWorkout);
}

export async function getWorkout(id: string): Promise<Workout | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, workout_sets(*))")
    .eq("id", id)
    .single();

  if (error) return null;
  return dbWorkoutToWorkout(data);
}

export async function addWorkout(workout: Workout): Promise<void> {
  const userId = await getUserId();
  const supabase = createServerSupabaseClient();

  // Insert workout
  const { error: workoutError } = await supabase.from("workouts").insert({
    id: workout.id,
    user_id: userId,
    title: workout.title,
    date: workout.date,
    created_at: workout.createdAt,
  });
  if (workoutError) throw workoutError;

  // Insert exercises
  for (let i = 0; i < workout.exercises.length; i++) {
    const ex = workout.exercises[i];
    const { error: exError } = await supabase
      .from("workout_exercises")
      .insert({
        id: ex.id,
        workout_id: workout.id,
        name: ex.name,
        notes: ex.notes,
        muscle_group: ex.muscleGroup || null,
        library_exercise_id: ex.libraryExerciseId || null,
        position: i,
      });
    if (exError) throw exError;

    // Insert sets for this exercise
    if (ex.sets.length > 0) {
      const { error: setsError } = await supabase
        .from("workout_sets")
        .insert(
          ex.sets.map((s, j) => ({
            id: s.id,
            exercise_id: ex.id,
            reps: s.reps,
            weight: s.weight,
            position: j,
          }))
        );
      if (setsError) throw setsError;
    }
  }
}

export async function deleteWorkout(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) throw error;
}

// ── Routines ──

export async function getRoutines(): Promise<Routine[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("routines")
    .select("*, routine_exercises(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(dbRoutineToRoutine);
}

export async function getRoutine(id: string): Promise<Routine | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("routines")
    .select("*, routine_exercises(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return dbRoutineToRoutine(data);
}

export async function addRoutine(routine: Routine): Promise<void> {
  const userId = await getUserId();
  const supabase = createServerSupabaseClient();

  const { error: routineError } = await supabase.from("routines").insert({
    id: routine.id,
    user_id: userId,
    name: routine.name,
    created_at: routine.createdAt,
  });
  if (routineError) throw routineError;

  if (routine.exercises.length > 0) {
    const { error: exError } = await supabase
      .from("routine_exercises")
      .insert(
        routine.exercises.map((ex, i) => ({
          id: ex.id,
          routine_id: routine.id,
          name: ex.name,
          muscle_group: ex.muscleGroup || null,
          library_exercise_id: ex.libraryExerciseId || null,
          target_sets: ex.targetSets,
          target_reps: ex.targetReps,
          position: i,
        }))
      );
    if (exError) throw exError;
  }
}

export async function deleteRoutine(id: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("routines").delete().eq("id", id);
  if (error) throw error;
}

// ── Saved Exercises (from external wger API) ──

export async function getSavedExercises(): Promise<SavedExercise[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("saved_exercises")
    .select("*")
    .order("saved_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(dbSavedExerciseToSavedExercise);
}

interface SaveExerciseInput {
  apiExerciseId: number;
  name: string;
  description: string;
  muscleGroup: string | null;
  muscles: WgerMuscle[];
  equipment: WgerEquipment[];
  imageUrl: string | null;
}

export async function saveExercise(input: SaveExerciseInput): Promise<void> {
  const userId = await getUserId();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("saved_exercises").insert({
    user_id: userId,
    api_exercise_id: input.apiExerciseId,
    name: input.name,
    description: input.description,
    muscle_group: input.muscleGroup,
    muscles: input.muscles,
    equipment: input.equipment,
    image_url: input.imageUrl,
  });

  // Ignore unique constraint violations (exercise already saved)
  if (error && error.code !== "23505") throw error;
}

export async function unsaveExercise(apiExerciseId: number): Promise<void> {
  const userId = await getUserId();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("saved_exercises")
    .delete()
    .eq("user_id", userId)
    .eq("api_exercise_id", apiExerciseId);

  if (error) throw error;
}

/**
 * Returns the most-saved wger exercises across ALL users (not just the
 * current one). Calls a SECURITY DEFINER Postgres function that bypasses
 * RLS so we can aggregate counts without exposing individual saves.
 *
 * Available to anonymous callers too — community favorites are public-safe
 * (just aggregate counts, no per-user data).
 */
export async function getCommunityFavorites(): Promise<CommunityFavorite[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_community_favorites");

  if (error) {
    console.error("Failed to load community favorites:", error);
    return [];
  }

  return (data || []).map(
    (r: {
      api_exercise_id: number;
      name: string;
      muscle_group: string | null;
      image_url: string | null;
      save_count: number | string;
    }) => ({
      apiExerciseId: r.api_exercise_id,
      name: r.name,
      muscleGroup: r.muscle_group,
      imageUrl: r.image_url,
      saveCount: Number(r.save_count),
    })
  );
}
