import { defineConfig } from "@playwright/test";

/**
 * Run with: npx playwright test -c playwright.prod.config.ts
 * Hits the deployed Vercel URL instead of localhost. No webServer is
 * started — assumes the production deployment is already live.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  // Production deploys have cold-start overhead and load Clerk JS from a CDN,
  // so allow more time per assertion than the local config does.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "https://workout-tracker-full-stack.vercel.app",
    trace: "on-first-retry",
    // Wait for hydration before running assertions
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
