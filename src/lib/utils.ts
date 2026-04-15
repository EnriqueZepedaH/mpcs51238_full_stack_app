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

/**
 * Rolling 7-day-window streak. Window 1 = days 0–6 ago, window 2 = days 7–13,
 * etc. The streak is alive while each consecutive window has at least one
 * workout; it breaks the moment a window is empty. `longest` scans the entire
 * history with the same logic to find the user's best run.
 */
export function getWeekStreak(workouts: Workout[]): {
  current: number;
  longest: number;
} {
  if (workouts.length === 0) return { current: 0, longest: 0 };

  // Build a Set of unique workout dates for O(1) lookup.
  const workoutDates = new Set(workouts.map((w) => w.date));

  // Find the earliest workout date so we know when to stop scanning history.
  const earliest = workouts.reduce(
    (min, w) => (w.date < min ? w.date : min),
    workouts[0].date
  );
  const earliestDate = new Date(earliest + "T00:00:00");

  // Helper: does a 7-day window starting `daysAgoEnd` days back (inclusive)
  // contain any workout? Window covers days [daysAgoEnd, daysAgoEnd+6] back.
  function windowHasWorkout(daysAgoEnd: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgoEnd - i);
      const key = d.toISOString().split("T")[0];
      if (workoutDates.has(key)) return true;
    }
    return false;
  }

  // Current streak: count consecutive 7-day windows back from today.
  let current = 0;
  let cursor = 0;
  while (windowHasWorkout(cursor)) {
    current++;
    cursor += 7;
  }

  // Longest streak: scan all overlapping daily-shifted windows across history.
  // A simpler equivalent: walk forward from earliest workout, week-by-week,
  // tracking the longest run of non-empty consecutive 7-day windows.
  let longest = 0;
  let run = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDaysSpan = Math.floor(
    (today.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // Iterate windows from oldest to newest in 7-day chunks.
  for (let offset = totalDaysSpan; offset >= 0; offset -= 7) {
    if (windowHasWorkout(offset)) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

/** Most-recent PRs (by date set), newest first. */
export function getRecentPRs(
  workouts: Workout[],
  limit: number
): PersonalRecord[] {
  return getPersonalRecords(workouts)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
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

export function getPRWeight(
  workouts: Workout[],
  exerciseName: string
): number | undefined {
  let max: number | undefined;
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.name === exerciseName) {
        for (const set of exercise.sets) {
          if (max === undefined || set.weight > max) {
            max = set.weight;
          }
        }
      }
    }
  }
  return max;
}

/**
 * Heaviest weight lifted for an exercise within the last `daysBack` days.
 * Matches exercise names case-insensitively so a routine entry "Bench Press"
 * picks up logged sets named "bench press" or "Bench press" too.
 */
export function getRecentPRWeight(
  workouts: Workout[],
  exerciseName: string,
  daysBack: number = 30
): number | undefined {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);
  cutoff.setHours(0, 0, 0, 0);
  const target = exerciseName.toLowerCase();

  let max: number | undefined;
  for (const workout of workouts) {
    const d = new Date(workout.date + "T00:00:00");
    if (d < cutoff) continue;

    for (const exercise of workout.exercises) {
      if (exercise.name.toLowerCase() !== target) continue;
      for (const set of exercise.sets) {
        if (max === undefined || set.weight > max) {
          max = set.weight;
        }
      }
    }
  }
  return max;
}

/** Rounds a weight to the nearest 5 (since plates come in 2.5 lb increments). */
export function roundToNearestFive(weight: number): number {
  return Math.round(weight / 5) * 5;
}

export function getMuscleGroupVolumes(
  exercises: Exercise[]
): Record<string, number> {
  const volumes: Record<string, number> = {};
  for (const ex of exercises) {
    if (!ex.muscleGroup) continue;
    const vol = ex.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    volumes[ex.muscleGroup] = (volumes[ex.muscleGroup] || 0) + vol;
  }
  return volumes;
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

export function getLast7DaysWorkouts(workouts: Workout[]): Workout[] {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  return workouts.filter((w) => {
    const d = new Date(w.date + "T00:00:00");
    return d >= cutoff;
  });
}
