"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Free forever · No credit card
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Track your lifts.
            <br />
            <span className="text-gray-400">Crush your PRs.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-gray-600 sm:text-lg">
            A clean, minimal workout tracker. Log workouts, build reusable
            routines, and explore 800+ exercises from the wger database.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Sign up free
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Browse exercises
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<DumbbellIcon className="h-5 w-5" />}
            title="Log workouts"
            body="Record sets, reps, and weight with smart defaults. Add notes and track every lift."
          />
          <FeatureCard
            icon={<RepeatIcon className="h-5 w-5" />}
            title="Reusable routines"
            body="Save your Push/Pull/Legs as templates and start a workout in one tap."
          />
          <FeatureCard
            icon={<SearchIcon className="h-5 w-5" />}
            title="Explore exercises"
            body="Search 800+ exercises from the wger database. Save your favorites for quick access."
          />
          <FeatureCard
            icon={<TrophyIcon className="h-5 w-5" />}
            title="Personal records"
            body="Auto-detect your best lifts and track weekly volume across muscle groups."
          />
          <FeatureCard
            icon={<HeatmapIcon className="h-5 w-5" />}
            title="Muscle heatmap"
            body="Visualize which muscles you've trained this week with a body silhouette overlay."
          />
          <FeatureCard
            icon={<LockIcon className="h-5 w-5" />}
            title="Yours alone"
            body="Your data is private. Only you can see your workouts, routines, and saved exercises."
          />
        </div>
      </section>

      {/* CTA strip */}
      <section className="mb-16 rounded-2xl border border-gray-200 bg-gray-900 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Ready to start tracking?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-300">
          Create a free account and log your first workout in under a minute.
        </p>
        <Link
          href="/sign-up"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          Get started
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1.5 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h-.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h.75m10.5-9h.75a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-.75M3 9v6m18-6v6M6.75 7.5v9m10.5-9v9M6.75 12h10.5" />
    </svg>
  );
}

function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.042 6.042 0 01-2.27.977m0 0a6.042 6.042 0 01-2.27-.977" />
    </svg>
  );
}

function HeatmapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
