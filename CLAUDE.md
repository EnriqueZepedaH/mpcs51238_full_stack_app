# Workout Tracker

A full-stack workout tracking app built with Next.js 16, Tailwind CSS v4, Clerk, and Supabase. Log workouts with exercises, sets, reps, and weight. Create reusable routines. Browse a static exercise library or explore 800+ exercises from the wger API and save favorites. View personal records and weekly progress. All data is per-user and persisted in Supabase.

## Security: Handling Secrets

**ALWAYS proactively warn the user the moment a secret is exposed in an insecure channel.** Do not wait to be asked.

A "secret" includes: API keys (Clerk `sk_*`, Supabase `service_role`, OAuth client secrets, JWT secrets), database passwords, private keys, session tokens, and webhook signing secrets. Anything prefixed with `NEXT_PUBLIC_*` is **not** secret — those are intentionally shipped to the browser.

Insecure channels include: chat messages, screenshots, Slack, email, terminal output that gets logged, git commits, comments in code, anywhere prefixed `NEXT_PUBLIC_*`, and `console.log` statements.

When a secret is pasted, shared, or about to be committed in any of these places, immediately:
1. Stop and call it out clearly (e.g., "⚠️ That secret key just landed in chat — that's a secondary exposure beyond your local env.")
2. Explain the risk in one sentence
3. Recommend rotating the key (Clerk Dashboard → API Keys → Roll keys; Supabase Dashboard → Settings → API → Reset)
4. Then continue with the task

Do this even if the user originally pasted the secret themselves — if it now appears in chat, screen-share, or anywhere else, it's a fresh exposure worth flagging. Do not echo secret values back unnecessarily; reference them by name (e.g., `CLERK_SECRET_KEY`) instead.

Safe places for secrets: `.env.local` (gitignored), Vercel/host environment variables, secret managers (1Password, Doppler, AWS Secrets Manager).

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Clerk for authentication (sign up, sign in, sign out)
- Supabase (Postgres) for persistence with Row Level Security
- React Context + useReducer for client state, Server Actions for mutations
- wger public API for external exercise data

## Pages

| Route | Page | Description |
|---|---|---|
| `/sign-in` | Sign In | Clerk-hosted sign-in flow |
| `/sign-up` | Sign Up | Clerk-hosted sign-up flow |
| `/` | Dashboard | Quick stats, recent workouts, muscle heatmap |
| `/workouts` | Workout List | All workouts sorted by date with calendar view |
| `/workouts/new` | Log Workout | Form to add a new workout (supports ?routine= param) |
| `/workouts/[id]` | Workout Detail | Full breakdown of a single workout |
| `/exercises` | Exercise Library | Browse ~45 static exercises filtered by muscle group |
| `/routines` | Routines | List of reusable workout templates |
| `/routines/new` | Create Routine | Form to define a routine with target sets/reps |
| `/routines/[id]` | Routine Detail | View routine, start workout from it |
| `/records` | Personal Records | Best lifts per exercise, weekly volume |
| `/explore` | Explore | Search and save exercises from the wger API |
| `/saved` | Saved | View saved exercises from the wger API |

## API Routes

| Route | Purpose |
|---|---|
| `/api/exercises/search?q=...` | Server-side proxy to wger search endpoint |
| `/api/exercises/[id]` | Server-side proxy for full wger exercise detail |

External API calls are made server-side (never from the browser) via Next.js route handlers.

## Data Model

```typescript
MuscleGroup = "Chest" | "Traps" | "Lats" | "Lower Back" | "Shoulders" | "Biceps"
            | "Triceps" | "Forearms" | "Quads" | "Hamstrings" | "Calves"
            | "Glutes" | "Core" | "Full Body"
LibraryExercise { id, name, muscleGroup }
WorkoutSet { id, reps, weight }
Exercise { id, name, notes, sets: WorkoutSet[], muscleGroup?, libraryExerciseId? }
Workout { id, date, title, exercises: Exercise[], createdAt }
RoutineExercise { id, name, muscleGroup?, libraryExerciseId?, targetSets, targetReps }
Routine { id, name, exercises: RoutineExercise[], createdAt }
SavedExercise { id, apiExerciseId, name, description, muscleGroup, muscles, equipment, imageUrl, savedAt }
```

## Database Schema (Supabase)

| Table | Purpose | Notes |
|---|---|---|
| `workouts` | One row per workout | RLS scoped to Clerk user_id |
| `workout_exercises` | Exercises in a workout | CASCADE on workout delete |
| `workout_sets` | Sets in an exercise | CASCADE on exercise delete |
| `routines` | One row per routine | RLS scoped to Clerk user_id |
| `routine_exercises` | Exercises in a routine | CASCADE on routine delete |
| `saved_exercises` | wger exercises saved by user | UNIQUE(user_id, api_exercise_id) |

All RLS policies use `auth.jwt() ->> 'sub'` to match the Clerk user ID.

## State Management

- Authentication: `<ClerkProvider>` wraps the root layout; middleware (`src/middleware.ts`) protects all routes except `/sign-in` and `/sign-up`
- App data: `<WorkoutProvider>` loads workouts and routines from Supabase on mount via server actions
- Mutations: `dispatch` in the context calls server actions then updates local state
- Saved exercises: managed locally in `/explore` and `/saved` pages via direct server action calls
- Exercise library is a static constant in `src/lib/exercise-library.ts`

## Server Actions

In `src/lib/actions.ts`:
- `getWorkouts`, `getWorkout`, `addWorkout`, `deleteWorkout`
- `getRoutines`, `getRoutine`, `addRoutine`, `deleteRoutine`
- `getSavedExercises`, `saveExercise`, `unsaveExercise`

The Supabase client (`src/lib/supabase.ts`) uses Clerk's `accessToken` callback so RLS policies see the correct `sub` claim.

## Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

## Style

Clean & minimal (Notion/Linear-inspired). Inter font, gray-50 background, white cards with borders, black accent buttons. Sidebar navigation with responsive mobile hamburger menu.

## Development

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx playwright test  # Run Playwright tests (currently broken — auth + seed data changes)
```
