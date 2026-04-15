import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes are visitable by guests. Protected actions inside them
// (e.g., the Save button on /explore) prompt the user to sign in.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/exercises(.*)",
  "/explore(.*)",
  "/api/exercises(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
