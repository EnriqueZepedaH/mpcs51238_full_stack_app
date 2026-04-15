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

---

## Automated in-session testing (Playwright + Playwright MCP)

**Status:** Idea / not started
**Why:** After every feature change I (or Claude) end up manually clicking through the app to verify it works — log in, open the page, fill the form, save, navigate to the detail page, etc. It's slow, error-prone, and we end up shipping changes without checking the obvious paths because the friction is too high. The existing Playwright suite (`tests/guest-experience.spec.ts`) only covers the unauthenticated guest flow because authenticated tests need Clerk testing tokens we never set up. We should be doing both: a real automated suite for regression safety, AND giving Claude direct browser control during sessions so verification is a tool call away instead of a human task.

### Two pieces

**1. Authenticated Playwright suite**
- Install `@clerk/testing` and create a Clerk testing API key in the dashboard
- Add a global setup that signs in a dedicated test user and persists the auth state to a file
- Reuse the auth state via `storageState` so each test starts already signed in
- Cover the high-value flows: log a workout, create a routine, start a workout from a routine (with auto-fill weights), save a wger exercise from `/explore`, see it in the workout picker, see it on `/saved`, unsave it
- Run alongside the existing guest tests in CI

**2. Playwright MCP integration for in-session use**
- Add the Microsoft Playwright MCP server: `claude mcp add --transport stdio playwright npx @playwright/mcp@latest` (or whatever the current install command is)
- Once authenticated, Claude can call `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, etc. directly from a chat session
- Workflow becomes: make a code change → Claude opens the app, exercises the feature, takes an accessibility snapshot, confirms the assertion → moves on
- Way faster than asking the human to check, especially for visual / interactive changes
- Treat it as the dev-loop equivalent of a unit test, not a replacement for the persistent suite

### Why deferred

The guest-side Playwright suite already catches the most common regressions (auth redirects, public pages, sign-in/sign-up rendering, the wger search proxy). Authenticated tests require Clerk dashboard configuration the developer hasn't done yet, and Playwright MCP needs a separate install + permissions grant. Both are low-risk, high-payoff additions but we've been able to ship without them.

### Open questions when picking this up

- Test user lifecycle: do we delete and recreate the user before each run, or rely on idempotent fixtures?
- Should authenticated tests hit a separate Supabase project (test DB) so they can freely insert/delete without polluting prod? Or run against the same DB with a unique test user_id and clean up after?
- For Playwright MCP, what permission scope makes sense? Allow it to run freely on `localhost:3000` only, or also against the deployed Vercel URL?
- Do we need to scope the MCP server's data access (cookies, localStorage) to avoid leaking the dev user's session beyond the test scenario?
