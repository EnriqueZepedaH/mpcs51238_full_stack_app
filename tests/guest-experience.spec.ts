import { test, expect } from "@playwright/test";

/**
 * Guest experience tests — runs against an unauthenticated browser.
 * Covers the marketing landing page, sign-in/sign-up redesign, public
 * route access, protected route redirects, and the wger Explore flow.
 *
 * Authenticated flows (logging workouts, managing routines, etc.) require
 * Clerk testing tokens via @clerk/testing — out of scope here.
 */

test.describe("Landing page (guest)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero with title and CTAs", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Track your lifts/i })
    ).toBeVisible();
    await expect(
      page.getByText(/clean, minimal workout tracker/i)
    ).toBeVisible();
  });

  test("Sign up free button links to /sign-up", async ({ page }) => {
    const cta = page
      .getByRole("link", { name: /Sign up free/i })
      .first();
    await expect(cta).toHaveAttribute("href", "/sign-up");
  });

  test("Browse exercises CTA links to /explore", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Browse exercises/i });
    await expect(cta).toHaveAttribute("href", "/explore");
  });

  test("shows feature cards", async ({ page }) => {
    // Use heading role to disambiguate from the hero subtext
    await expect(
      page.getByRole("heading", { name: "Log workouts" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Reusable routines" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Explore exercises" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Personal records" })
    ).toBeVisible();
  });

  test("CTA strip at bottom links to /sign-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Ready to start tracking/i })
    ).toBeVisible();
    const cta = page.getByRole("link", { name: /^Get started$/i });
    await expect(cta).toHaveAttribute("href", "/sign-up");
  });
});

test.describe("Sidebar (guest)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("shows public nav items", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Library" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Explore" })).toBeVisible();
  });

  test("does NOT show protected nav items", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(
      sidebar.getByRole("link", { name: "Workouts" })
    ).toHaveCount(0);
    await expect(
      sidebar.getByRole("link", { name: "Routines" })
    ).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "Saved" })).toHaveCount(0);
    await expect(sidebar.getByRole("link", { name: "Records" })).toHaveCount(0);
  });

  test("shows Sign in and Sign up buttons", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: /Sign up free/i })
    ).toBeVisible();
  });

  test("does NOT show Log Workout button", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(
      sidebar.getByRole("link", { name: /Log Workout/i })
    ).toHaveCount(0);
  });
});

test.describe("Public routes are accessible to guests", () => {
  test("/ loads landing page", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /Track your lifts/i })
    ).toBeVisible();
  });

  test("/exercises loads exercise library", async ({ page }) => {
    const response = await page.goto("/exercises");
    expect(response?.status()).toBe(200);
    // Should not redirect to sign-in
    await expect(page).toHaveURL(/\/exercises/);
  });

  test("/explore loads explore page with guest banner", async ({ page }) => {
    const response = await page.goto("/explore");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/explore/);
    await expect(
      page.getByText(/Browsing as guest/i)
    ).toBeVisible();
  });
});

test.describe("Protected routes redirect to sign-in", () => {
  for (const path of ["/workouts", "/routines", "/saved", "/records"]) {
    test(`${path} redirects guest to sign-in`, async ({ page }) => {
      await page.goto(path);
      // Clerk should redirect to sign-in page
      await page.waitForURL(/\/sign-in/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/sign-in/);
    });
  }
});

test.describe("Sign-in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
  });

  test("loads with branded header", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Workout Tracker/i }).first()
    ).toBeVisible();
  });

  test("shows Welcome back heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Welcome back/i })
    ).toBeVisible();
  });

  test("shows tagline", async ({ page }) => {
    await expect(
      page.getByText(/Sign in to continue tracking your workouts/i)
    ).toBeVisible();
  });

  test("renders Clerk sign-in form", async ({ page }) => {
    // Clerk's form has an email input
    await expect(
      page.locator("input[name='identifier'], input[type='email']").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("logo links back to home", async ({ page }) => {
    const logo = page
      .getByRole("link", { name: /Workout Tracker/i })
      .first();
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("does NOT show the main app sidebar", async ({ page }) => {
    // Auth pages have their own full-screen layout
    await expect(page.locator("aside")).toHaveCount(0);
  });
});

test.describe("Sign-up page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-up");
  });

  test("loads with branded header", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Workout Tracker/i }).first()
    ).toBeVisible();
  });

  test("shows Create your account heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Create your account/i })
    ).toBeVisible();
  });

  test("shows tagline", async ({ page }) => {
    await expect(
      page.getByText(/Start tracking your lifts in seconds/i)
    ).toBeVisible();
  });

  test("renders Clerk sign-up form", async ({ page }) => {
    // Clerk's sign-up first asks for an identifier — could be username,
    // email, or phone depending on the Clerk app config. Check for any
    // input field rendered by Clerk's form.
    await expect(
      page.locator("form input").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("has link to sign-in", async ({ page }) => {
    const link = page
      .locator("a[href='/sign-in']")
      .filter({ hasText: /sign in/i })
      .first();
    await expect(link).toBeVisible();
  });
});

test.describe("Explore page (guest)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/explore");
  });

  test("shows guest banner with sign-in CTA", async ({ page }) => {
    const banner = page.getByText(/Browsing as guest/i);
    await expect(banner).toBeVisible();
    const signInLink = page
      .locator("a[href*='/sign-in']")
      .filter({ hasText: /Sign in/i })
      .first();
    await expect(signInLink).toBeVisible();
  });

  test("search input is visible", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/Search exercises/i)
    ).toBeVisible();
  });

  test("typing a query returns wger results", async ({ page }) => {
    await page.getByPlaceholder(/Search exercises/i).fill("bench");
    // Wait for debounced search + API response
    await expect(page.getByText("Bench Press").first()).toBeVisible({
      timeout: 8000,
    });
  });

  test("Save button redirects guest to sign-in", async ({ page }) => {
    await page.getByPlaceholder(/Search exercises/i).fill("bench");
    await expect(page.getByText("Bench Press").first()).toBeVisible({
      timeout: 8000,
    });

    // Click the first Save button
    await page
      .getByRole("button", { name: /^Save$/i })
      .first()
      .click();

    await page.waitForURL(/\/sign-in/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe("Exercise library page (guest)", () => {
  test("loads and shows exercises", async ({ page }) => {
    await page.goto("/exercises");
    // Should display at least one exercise from the static library
    await expect(page.getByText(/Bench Press/i).first()).toBeVisible();
  });
});

test.describe("API routes", () => {
  test("/api/exercises/search returns suggestions for guests", async ({
    request,
  }) => {
    const response = await request.get("/api/exercises/search?q=bench");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.suggestions)).toBe(true);
    expect(data.suggestions.length).toBeGreaterThan(0);
    expect(data.suggestions[0].data.name).toMatch(/bench/i);
  });

  test("/api/exercises/search with empty query returns empty array", async ({
    request,
  }) => {
    const response = await request.get("/api/exercises/search?q=");
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.suggestions).toEqual([]);
  });
});
