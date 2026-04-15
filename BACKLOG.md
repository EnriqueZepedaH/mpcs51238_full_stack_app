# Workout Tracker — Backlog

Future feature ideas and improvements that aren't blocking but would meaningfully improve the app. Each entry has enough context to pick up cold.

---

## Personalized activity goals (drives streak + dashboard insights)

**Status:** Idea / not started
**Why:** The current streak metric uses a single hardcoded definition (rolling 7-day window with at least 1 workout). Different users have very different training cadences — daily lifters, 4-day splits, three-times-a-week generalists, "stay active" types — and a one-size-fits-all streak doesn't motivate everyone equally.

### Goal types to support

| Type | Definition | Streak meaning |
|---|---|---|
| `daily` | Workout every day, no gap | Consecutive days with ≥1 workout |
| `weekly_count` | N workouts per week (e.g., 4/week) | Consecutive weeks meeting the target |
| `split_cadence` | Specific muscle groups N times/week (e.g., upper body 2x, lower body 2x) | Consecutive weeks where each named bucket hits its target |
| `max_gap` | Never let N days pass without a workout (e.g., 3-day max gap) | Consecutive periods where no gap exceeded the limit |

### Where it lives

- **DB**: New Supabase table `user_goals` keyed by `user_id`, with `goal_type` (text) and `params` (jsonb). One row per user. RLS scoped to `auth.jwt() ->> 'sub'` like the other tables.
- **Code**: `src/lib/utils.ts` already has `getWeekStreak`. Refactor it into a strategy pattern: `getStreak(workouts, goal)` that dispatches on `goal.type`. Each goal type gets its own implementation.
- **UI**:
  - New `/settings` (or `/profile`) page where the user picks their goal type and parameters
  - `StreakCard` reads the user's goal and renders the appropriate label (e.g., "4 weeks at 4×/week" instead of just "6 weeks")
  - `WeekStrip` could overlay the goal — e.g., for `weekly_count: 4`, dim days beyond the target count
- **Defaults**: New users default to the existing rolling-7-day-window goal so the dashboard is never empty.

### Why deferred

The current rolling-7-day streak is good enough for the MVP and is the simplest motivating metric. Personalization is a multiplier on top of that base, not a replacement. Build it once we have actual users with feedback about which cadence patterns matter most.

### Open questions when picking this up

- Do streaks reset on goal change, or do we recompute history under the new rules?
- Should "max_gap" allow rest days within the gap, or strictly count calendar days?
- For `split_cadence`, do we let users name custom buckets (e.g., "core", "cardio")?
