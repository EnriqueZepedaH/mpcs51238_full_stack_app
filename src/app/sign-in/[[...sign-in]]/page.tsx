import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-bold">
            W
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Workout Tracker
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue tracking your workouts
            </p>
          </div>

          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border border-gray-200 rounded-xl",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border-gray-300 hover:bg-gray-50 normal-case",
                  formButtonPrimary:
                    "bg-gray-900 hover:bg-gray-800 normal-case text-sm",
                  footerActionLink: "text-gray-900 hover:text-gray-700",
                },
              }}
              signUpUrl="/sign-up"
            />
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to keep your workouts up to date.
          </p>
        </div>
      </main>
    </div>
  );
}
