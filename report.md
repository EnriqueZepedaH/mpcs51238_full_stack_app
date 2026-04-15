# Assignment 3 - Reflection Questions

## 1. Trace a request: a user searches, saves, and views it on their profile. What systems are involved?

I'll trace the "search, save, view" flow on the Explore page (`/explore`).

The user types a query like "bench press" into the search input. The component debounces for 300ms then fires a `fetch` to `/api/exercises/search?q=bench+press`, which is a Next.js API route in `src/app/api/exercises/search/route.ts`. That route proxies to the wger public API (`https://wger.de/api/v2/exerciseinfo/?name__search=...&language__code=en`), normalizes the response (pulls out the English translation since the original site is in german, finds the main image, flattens the nested structure), and returns a clean list of suggestions. The fetch uses `next: { revalidate: 300 }` so the server caches results for 5 minutes.

Results render as cards. The user clicks Save, which calls the `saveExercise()` server action in `src/lib/actions.ts`. That function calls `auth()` from Clerk to get the current userId, then creates a Supabase client via `createServerSupabaseClient()` (which passes Clerk's access token through the `accessToken` callback). It inserts a row into the `saved_exercises` table with the user's ID, exercise name, muscle info, and image URL. Supabase RLS policies enforce that you can only insert rows where `user_id` matches `auth.jwt() ->> 'sub'` (the Clerk user ID in the JWT).

Later the user goes to `/saved`. The page reads from `WorkoutContext`, which already loaded the user's saved exercises on mount via the `getSavedExercises()` server action — that's a `SELECT` on `saved_exercises` where RLS automatically scopes the query to the current user. So even on `/saved`, the picker on `/workouts/new`, and the heart/save state on `/explore`, all three components see the same in-memory list and stay in sync without refetching.

Systems involved: the browser (React client components), the Next.js server (API routes + server actions, hosted on Vercel), wger API (external exercise data), Clerk (authentication + JWT), and Supabase (Postgres database + RLS enforcement).

## 2. Why should your app call the external API from the server (API route) instead of directly from the browser?

A few reasons. First, if we ever needed an API key for wger, it would stay on the server and never get shipped to the browser. We don't have one right now but that's a general best practice. Second, CORS — wger doesn't necessarily set permissive CORS headers, so the browser might just block the request. Going through our own API route avoids that entirely since it's same-origin.

Third, caching. Our server route uses `next: { revalidate: 300 }` to cache responses for 5 minutes. If 10 users search "squat" in the same window, the server returns the cached result instead of hitting wger 10 times. Browsers would each make their own request. Fourth, the server route does data transformation — it normalizes wger's nested response (extracting the English translation from the `translations` array, finding the main image) into the shape the Explore page expects. That logic runs once on the server instead of being shipped in the client bundle.

There's also rate limiting to think about. If we need to add backoff or throttling later, one server-side choke point is way easier to manage than N different user browsers all hammering the external API independently.

## 3. A classmate signs up on your app. What data does Clerk store vs. what does Supabase store? How are they connected?

**Clerk** stores the identity and auth stuff. Email, password hash (or OAuth tokens if they used Google sign-in), name, session data, JWT signing keys.

**Supabase** stores everything application-related. Workouts, exercises, sets, routines, saved exercises from the wger API. Every table that holds user data has a `user_id` text column that gets populated from Clerk's user ID.

They're connected through Clerk's "Connect with Supabase" integration. The setup was: in Clerk I enabled the Supabase integration under Integrations, which adds a `role: "authenticated"` claim to session tokens. In Supabase I added Clerk as a third-party auth provider under Authentication and pointed it at my Clerk domain. In the app code, `createServerSupabaseClient()` in `src/lib/supabase.ts` passes Clerk's access token to the Supabase client via the `accessToken` callback: `accessToken: async () => (await auth()).getToken()`. Then every RLS policy on every Supabase table uses `auth.jwt() ->> 'sub'` to match the JWT's `sub` claim (which is the Clerk user ID) against the `user_id` column. So even if someone tried to query another user's data, RLS would block it at the database level.

## 4. Ask Claude (with MCP) to describe your database. Paste the response. Does it match your mental model?

I asked Claude with the Supabase MCP to list all tables. Here's what it returned (6 tables, all with RLS enabled):

| Table | Rows | Key Columns |
|---|---|---|
| **workouts** | 2 | `id` (uuid PK), `user_id` (text), `title`, `date`, `created_at` |
| **workout_exercises** | 6 | `id` (uuid PK), `workout_id` (FK → workouts), `name`, `notes`, `muscle_group`, `library_exercise_id`, `position` |
| **workout_sets** | 18 | `id` (uuid PK), `exercise_id` (FK → workout_exercises), `reps` (int), `weight` (numeric), `position` |
| **routines** | 1 | `id` (uuid PK), `user_id` (text), `name`, `created_at` |
| **routine_exercises** | 3 | `id` (uuid PK), `routine_id` (FK → routines), `name`, `muscle_group`, `library_exercise_id`, `target_sets`, `target_reps`, `position` |
| **saved_exercises** | 5 | `id` (uuid PK), `user_id` (text), `api_exercise_id` (int), `name`, `description`, `muscle_group`, `muscles` (jsonb), `equipment` (jsonb), `image_url`, `saved_at` |

Yes, this matches my mental model pretty closely. There are three "parent" tables scoped to users via `user_id`: `workouts`, `routines`, and `saved_exercises`. The workout structure is normalized into three levels — `workouts` → `workout_exercises` → `workout_sets` — which mirrors the TypeScript types from Assignment 2 (a Workout contains Exercises, each Exercise contains Sets). Routines follow the same pattern with `routines` → `routine_exercises`.

`saved_exercises` is a flat table since it stores metadata directly from the wger API (muscles and equipment as jsonb blobs) rather than normalizing further. The `library_exercise_id` field on `workout_exercises` and `routine_exercises` threads back to the static 45-exercise library defined in TypeScript code — it's not a real foreign key in Postgres because that library lives in `src/lib/exercise-library.ts`, not in the database.

There's also one Postgres function I added: `get_community_favorites(min_saves int, max_results int)`. It groups `saved_exercises` by `api_exercise_id` and returns the most-saved ones across all users, with a `save_count`. It's marked `SECURITY DEFINER` so it can bypass the per-user RLS policy (otherwise a normal client query would only count the caller's own rows). I granted EXECUTE to both `authenticated` and `anon` so even guests browsing `/explore` see Community Favorites — only aggregate counts are exposed, never individual saves.

One thing that surprised me: I originally thought I'd need to manually create a JWT template in Clerk to get the Supabase integration working. The older tutorials all show that flow. But the newer "Connect with Supabase" approach using the publishable key and third-party auth provider setup handles it automatically, which made the whole thing much simpler than expected.
