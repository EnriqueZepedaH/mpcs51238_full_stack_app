import { Workout, Exercise, MuscleGroup } from "./types";

export function calcVolume(exercises: Exercise[]): number {
  return exercises.reduce(
    (total, ex) =>
      total + ex.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
    0
  );
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export interface PersonalRecord {
  exerciseName: string;
  muscleGroup?: MuscleGroup;
  maxWeight: number;
  reps: number;
  date: string;
  workoutId: string;
}

export function getPersonalRecords(workouts: Workout[]): PersonalRecord[] {
  const records = new Map<string, PersonalRecord>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        const existing = records.get(exercise.name);
        if (!existing || set.weight > existing.maxWeight) {
          records.set(exercise.name, {
            exerciseName: exercise.name,
            muscleGroup: exercise.muscleGroup,
            maxWeight: set.weight,
            reps: set.reps,
            date: workout.date,
            workoutId: workout.id,
          });
        }
      }
    }
  }

  return Array.from(records.values()).sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName)
  );
}

export interface WeeklySummary {
  weekLabel: string;
  workoutCount: number;
  totalVolume: number;
  exerciseNames: string[];
}

export function getWeeklySummaries(workouts: Workout[]): WeeklySummary[] {
  const weeks = new Map<string, WeeklySummary>();

  for (const workout of workouts) {
    const date = new Date(workout.date + "T00:00:00");
    const monday = new Date(date);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(date.getDate() + diff);
    const weekKey = monday.toISOString().split("T")[0];

    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);
    const weekLabel = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    const existing = weeks.get(weekKey) || {
      weekLabel,
      workoutCount: 0,
      totalVolume: 0,
      exerciseNames: [],
    };

    existing.workoutCount += 1;
    existing.totalVolume += calcVolume(workout.exercises);
    for (const ex of workout.exercises) {
      if (!existing.exerciseNames.includes(ex.name)) {
        existing.exerciseNames.push(ex.name);
      }
    }

    weeks.set(weekKey, existing);
  }

  return Array.from(weeks.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, summary]) => summary);
}

export function getThisWeekWorkouts(workouts: Workout[]): Workout[] {
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return workouts.filter((w) => {
    const d = new Date(w.date + "T00:00:00");
    return d >= monday;
  });
}
