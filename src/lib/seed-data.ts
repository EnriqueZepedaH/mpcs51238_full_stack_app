import { Workout } from "./types";

export const seedWorkouts: Workout[] = [
  {
    id: "w1",
    date: "2026-04-07",
    title: "Upper Body Push",
    createdAt: "2026-04-07T09:00:00Z",
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        notes: "Felt strong today",
        sets: [
          { id: "s1", reps: 8, weight: 185 },
          { id: "s2", reps: 8, weight: 185 },
          { id: "s3", reps: 6, weight: 195 },
        ],
      },
      {
        id: "e2",
        name: "Overhead Press",
        notes: "",
        sets: [
          { id: "s4", reps: 10, weight: 95 },
          { id: "s5", reps: 8, weight: 105 },
          { id: "s6", reps: 8, weight: 105 },
        ],
      },
      {
        id: "e3",
        name: "Incline Dumbbell Press",
        notes: "",
        sets: [
          { id: "s7", reps: 12, weight: 55 },
          { id: "s8", reps: 10, weight: 60 },
        ],
      },
    ],
  },
  {
    id: "w2",
    date: "2026-04-05",
    title: "Leg Day",
    createdAt: "2026-04-05T10:30:00Z",
    exercises: [
      {
        id: "e4",
        name: "Squat",
        notes: "New PR!",
        sets: [
          { id: "s9", reps: 5, weight: 275 },
          { id: "s10", reps: 5, weight: 275 },
          { id: "s11", reps: 3, weight: 295 },
        ],
      },
      {
        id: "e5",
        name: "Romanian Deadlift",
        notes: "",
        sets: [
          { id: "s12", reps: 10, weight: 185 },
          { id: "s13", reps: 10, weight: 185 },
          { id: "s14", reps: 8, weight: 205 },
        ],
      },
      {
        id: "e6",
        name: "Leg Press",
        notes: "",
        sets: [
          { id: "s15", reps: 12, weight: 360 },
          { id: "s16", reps: 10, weight: 405 },
        ],
      },
    ],
  },
  {
    id: "w3",
    date: "2026-04-03",
    title: "Pull Day",
    createdAt: "2026-04-03T08:00:00Z",
    exercises: [
      {
        id: "e7",
        name: "Deadlift",
        notes: "",
        sets: [
          { id: "s17", reps: 5, weight: 315 },
          { id: "s18", reps: 5, weight: 315 },
          { id: "s19", reps: 3, weight: 335 },
        ],
      },
      {
        id: "e8",
        name: "Barbell Row",
        notes: "Focus on form",
        sets: [
          { id: "s20", reps: 8, weight: 155 },
          { id: "s21", reps: 8, weight: 155 },
          { id: "s22", reps: 8, weight: 155 },
        ],
      },
      {
        id: "e9",
        name: "Pull-ups",
        notes: "",
        sets: [
          { id: "s23", reps: 10, weight: 0 },
          { id: "s24", reps: 8, weight: 0 },
          { id: "s25", reps: 7, weight: 0 },
        ],
      },
    ],
  },
  {
    id: "w4",
    date: "2026-04-01",
    title: "Upper Body Push",
    createdAt: "2026-04-01T09:15:00Z",
    exercises: [
      {
        id: "e10",
        name: "Bench Press",
        notes: "",
        sets: [
          { id: "s26", reps: 8, weight: 175 },
          { id: "s27", reps: 8, weight: 180 },
          { id: "s28", reps: 6, weight: 185 },
        ],
      },
      {
        id: "e11",
        name: "Overhead Press",
        notes: "",
        sets: [
          { id: "s29", reps: 10, weight: 90 },
          { id: "s30", reps: 8, weight: 95 },
        ],
      },
    ],
  },
];
