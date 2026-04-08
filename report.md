# Assignment 2 - Reflection Questions

## 1. What's in your CLAUDE.md? How did your plan shape what Claude built — and how did it evolve as you worked?

My CLAUDE.md describes the Workout Tracker app — what it does, all 9 routes, the data model (TypeScript interfaces), state management approach, and the visual style I was going for (clean, minimal, Notion/Linear-inspired).

The initial plan was pretty straightforward: 5 pages, a simple data model with workouts containing exercises and sets. I started by describing the kind of app I wanted — something I'd actually use to track my lifts — and picked a clean visual direction. Claude scaffolded the basics from that, and the first few commits were just getting the core loop working: home dashboard, workout list, add workout form, workout detail page (the dynamic route), workout records.

But the plan evolved a lot as I used the app and thought about what was missing. I kept comparing it to real workout apps I've used in the past and realized the UI was lacking key characteristics, for example in the add workout form, the exercise name field just a text input. So I asked Claude to add an exercise library with muscle groups and a searchable combobox. Then I wanted to save workout templates so I wouldn't have to rebuild the same routine every time, which led to the routines feature that work as reusable template for future workouts. Another nice featuer I decided to add as I iterated was the muscle heatmap. It is very useful to have a quick visual of which muscles I hit during each workout and which muscles I've hit in the last week (which can be seen in the home dashboard). But, then I realized the heatmap was too coarse (all of "Back" lit up the same), so I refactored the heatmap into a 3-tier hierarchy with 14 granular muscle groups (e.g. lats, traps and lower back are considered different muscle gorups).

The CLAUDE.md itself got updated along the way to reflect new pages and types as they were added.

## 2. Pick one page. Trace the path: what file renders it, what's the route, what components does it use, where does the data come from?

I'll trace the **Workout Detail** page at `/workouts/[id]`.

**Route:** `/workouts/[id]` — this is a dynamic route. Visiting `/workouts/w1` renders the detail for the workout with id `w1`.

**File:** `src/app/workouts/[id]/page.tsx`. It's a client component (`"use client"`) because it needs to read from React Context and use `useState` for the delete confirmation.

**How it gets the ID:** The `params` prop is a Promise in Next.js 16, so the component uses React's `use()` hook to unwrap it: `const { id } = use(params)`.

**Where the data comes from:** The component calls `useWorkouts()` which reads from the global `WorkoutContext` (defined in `src/lib/workout-context.tsx`). It does `state.workouts.find(w => w.id === id)` to get the specific workout. All data lives in client-side memory — initialized from seed data in `src/lib/seed-data.ts`, modified by dispatching actions to the reducer.

**Components it uses:**
- `ExerciseDetail` (`src/components/exercise-detail.tsx`) — renders each exercise with its sets table (reps, weight, volume per set) and a muscle group badge
- `MuscleHeatmap` (`src/components/muscle-heatmap.tsx`) — the SVG body silhouette showing which muscles were targeted, colored by volume
- `MuscleGroupBadge` (via ExerciseDetail) — small pill showing the muscle group name

**Layout:** The page is wrapped by the root layout (`src/app/layout.tsx`) which provides the sidebar navigation and the `WorkoutProvider` context. It shows a back link, the workout title and date, three summary stat cards (exercises, sets, volume), the muscle heatmap, and then the exercise list.

If the workout ID doesn't match anything in state, it renders a "Workout not found" message with a link back to the workouts list.

## 3. Describe one thing that happened when Claude tested your app with Playwright MCP. How did the build → verify loop change how you worked?

When I added the exercise combobox (replacing the old plain text input), the existing Playwright tests broke. The tests were looking for an input with `placeholder="Exercise name"`, but the combobox changed that to `placeholder="Search exercises..."`. The tests caught this immediately — they failed with a timeout waiting for an element that no longer existed.

This was actually a useful moment because it showed me that the tests were verifying real UI contracts. The fix was simple (update the placeholder string in the test), but it made me realize that every UI change has downstream effects on test selectors. Later, when I ran the comprehensive test suite (31 tests across all pages), a bunch failed not because of app bugs but because of strict mode violations — selectors like `getByText("Bench Press")` matching multiple elements on the page (the combobox dropdown, workout cards, etc.). Fixing those forced me to write more precise selectors like `.first()` and `{ exact: true }`.

The build-verify loop made me more confident about shipping changes. Instead of manually clicking through every page after each feature, I could add the feature, run the tests, and know immediately if something broke. It also caught things I wouldn't have noticed manually — like the fact that deleting a workout and checking the redirect needed `{ name: "Workouts", exact: true }` because "Recent Workouts" was also a heading on that page.
