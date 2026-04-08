# Workout Tracker

A personal workout tracking app built with Next.js 16 and Tailwind CSS v4. Log workouts with exercises, sets, reps, and weight. View personal records and weekly progress.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- React Context + useReducer for state management
- Client-side state only (data resets on refresh)

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Quick stats, recent workouts, CTA to log |
| `/workouts` | Workout List | All workouts sorted by date |
| `/workouts/new` | Log Workout | Form to add a new workout |
| `/workouts/[id]` | Workout Detail | Full breakdown of a single workout |
| `/records` | Personal Records | Best lifts per exercise, weekly volume |

## Data Model

```typescript
WorkoutSet { id, reps, weight }
Exercise { id, name, notes, sets: WorkoutSet[] }
Workout { id, date, title, exercises: Exercise[], createdAt }
```

## State Management

React Context wraps the app via `WorkoutProvider` in the root layout. Actions: ADD_WORKOUT, DELETE_WORKOUT, UPDATE_WORKOUT. Seed data provides sample workouts on first load.

## Style

Clean & minimal (Notion/Linear-inspired). Inter font, gray-50 background, white cards with borders, black accent buttons. Sidebar navigation.

## Development

```bash
npm run dev    # Start dev server on localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```
