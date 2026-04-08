import { test, expect } from "@playwright/test";

// ============================================================
// DASHBOARD PAGE
// ============================================================
test.describe("Dashboard", () => {
  test("loads with all key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Total Workouts")).toBeVisible();
    await expect(page.getByText("Days Active")).toBeVisible();
    await expect(page.getByText("Total Volume")).toBeVisible();
    await expect(page.getByText("Recent Workouts")).toBeVisible();
  });

  test("shows seed workout data", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Upper Body Push").first()).toBeVisible();
    await expect(page.getByText("Leg Day").first()).toBeVisible();
  });

  test("muscle heatmap is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Muscles Targeted").first()).toBeVisible();
  });

  test("Log Workout button navigates correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Log Workout" }).first().click();
    await expect(page.getByRole("heading", { name: "Log Workout" })).toBeVisible();
  });
});

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================
test.describe("Sidebar Navigation", () => {
  test("all nav links work", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Workouts" }).first().click();
    await expect(page.getByRole("heading", { name: "Workouts" })).toBeVisible();

    await page.getByRole("link", { name: "Exercises" }).first().click();
    await expect(page.getByRole("heading", { name: "Exercise Library" })).toBeVisible();

    await page.getByRole("link", { name: "Routines" }).first().click();
    await expect(page.getByRole("heading", { name: "Routines" })).toBeVisible();

    await page.getByRole("link", { name: "Records" }).first().click();
    await expect(page.getByRole("heading", { name: "Personal Records" })).toBeVisible();

    await page.getByRole("link", { name: "Dashboard" }).first().click();
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});

// ============================================================
// WORKOUT LIST + CALENDAR
// ============================================================
test.describe("Workouts Page", () => {
  test("shows calendar and workout list", async ({ page }) => {
    await page.goto("/workouts");
    await expect(page.getByRole("button", { name: "Month" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Week" })).toBeVisible();
    await expect(page.getByText("Recent Workouts")).toBeVisible();
  });

  test("calendar month navigation works", async ({ page }) => {
    await page.goto("/workouts");
    const heading = page.locator(".calendar-container h3");
    const initialText = await heading.textContent();
    await page.locator(".calendar-container button").first().click();
    const newText = await heading.textContent();
    expect(newText).not.toBe(initialText);
  });

  test("calendar week view toggle works", async ({ page }) => {
    await page.goto("/workouts");
    await page.getByRole("button", { name: "Week" }).click();
    await expect(page.getByText("Mon", { exact: true })).toBeVisible();
  });

  test("clicking seed workout navigates to detail", async ({ page }) => {
    await page.goto("/workouts");
    await page.locator("a").filter({ hasText: "Upper Body Push" }).first().click();
    await expect(page.getByRole("heading", { name: "Upper Body Push" }).first()).toBeVisible();
  });
});

// ============================================================
// WORKOUT DETAIL (DYNAMIC ROUTE)
// ============================================================
test.describe("Workout Detail", () => {
  test("shows workout info and heatmap", async ({ page }) => {
    await page.goto("/workouts");
    await page.locator("a").filter({ hasText: "Pull Day" }).first().click();
    await expect(page.getByRole("heading", { name: "Pull Day" })).toBeVisible();
    await expect(page.getByText("Deadlift").first()).toBeVisible();
    await expect(page.getByText("Barbell Row").first()).toBeVisible();
    await expect(page.getByText("Muscles Targeted")).toBeVisible();
  });

  test("delete confirmation shows and can be cancelled", async ({ page }) => {
    await page.goto("/workouts");
    await page.locator("a").filter({ hasText: "Pull Day" }).first().click();
    await page.locator("button").filter({ has: page.locator("path[d*='14.74']") }).click();
    await expect(page.getByText("Delete this workout?")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Delete this workout?")).not.toBeVisible();
  });

  test("shows 404 for nonexistent workout", async ({ page }) => {
    await page.goto("/workouts/nonexistent-id");
    await expect(page.getByText("Workout not found")).toBeVisible();
  });
});

// ============================================================
// NEW WORKOUT FORM
// ============================================================
test.describe("New Workout Form", () => {
  test("form loads with default fields", async ({ page }) => {
    await page.goto("/workouts/new");
    await expect(page.getByPlaceholder("e.g. Upper Body Push")).toBeVisible();
    await expect(page.getByPlaceholder("Search exercises...")).toBeVisible();
  });

  test("exercise combobox shows dropdown results", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByPlaceholder("Search exercises...").fill("bench");
    await expect(page.locator("ul li").first()).toBeVisible();
  });

  test("quick add sets generates sets", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByText("Quick add sets").click();
    await expect(page.getByRole("button", { name: "Generate Sets" })).toBeVisible();
    await page.getByRole("button", { name: "Generate Sets" }).click();
  });

  test("can add exercises", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByRole("button", { name: "+ Add Exercise" }).click();
    const comboboxes = page.getByPlaceholder("Search exercises...");
    await expect(comboboxes).toHaveCount(2);
  });

  test("submitting form creates workout", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByPlaceholder("e.g. Upper Body Push").fill("Test Session");
    await page.getByPlaceholder("Search exercises...").fill("Squat");
    await page.getByPlaceholder("Reps").fill("5");
    await page.getByPlaceholder("Weight (lbs)").fill("225");
    await page.getByRole("button", { name: "Save Workout" }).click();
    await expect(page.getByRole("heading", { name: "Test Session" })).toBeVisible();
  });

  test("selecting library exercise shows PR hint", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByPlaceholder("Search exercises...").fill("Bench Press");
    await page.locator("ul li button").first().click();
    await expect(page.getByText(/PR:.*lbs/)).toBeVisible();
  });
});

// ============================================================
// EXERCISE LIBRARY
// ============================================================
test.describe("Exercise Library", () => {
  test("shows exercises and filter pills", async ({ page }) => {
    await page.goto("/exercises");
    await expect(page.getByRole("heading", { name: "Exercise Library" })).toBeVisible();
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chest" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  });

  test("filtering by Chest shows only chest exercises", async ({ page }) => {
    await page.goto("/exercises");
    await page.getByRole("button", { name: "Chest" }).click();
    await expect(page.getByText("Bench Press").first()).toBeVisible();
    await expect(page.getByText("Squat")).not.toBeVisible();
  });

  test("search filters exercises", async ({ page }) => {
    await page.goto("/exercises");
    await page.getByPlaceholder("Search exercises...").fill("deadlift");
    await expect(page.getByText("Deadlift").first()).toBeVisible();
    await expect(page.getByText("Bench Press")).not.toBeVisible();
  });
});

// ============================================================
// ROUTINES
// ============================================================
test.describe("Routines", () => {
  test("shows seed routines", async ({ page }) => {
    await page.goto("/routines");
    await expect(page.getByText("Push Day")).toBeVisible();
    await expect(page.getByText("Pull Day")).toBeVisible();
    await expect(page.getByText("Leg Day")).toBeVisible();
  });

  test("routine detail shows exercises and Start Workout", async ({ page }) => {
    await page.goto("/routines");
    await page.getByText("Push Day").first().click();
    await expect(page.getByRole("heading", { name: "Push Day" })).toBeVisible();
    await expect(page.getByText("Bench Press")).toBeVisible();
    await expect(page.getByText("Start Workout")).toBeVisible();
  });

  test("start workout from routine pre-fills form", async ({ page }) => {
    await page.goto("/routines");
    await page.getByText("Push Day").first().click();
    await page.getByText("Start Workout").click();
    await expect(page.getByText("From routine: Push Day")).toBeVisible();
  });

  test("create new routine", async ({ page }) => {
    await page.goto("/routines/new");
    await page.getByPlaceholder("e.g. Push Day").fill("My Routine");
    await page.getByPlaceholder("Search exercises...").fill("Squat");
    await page.locator("ul li button").first().click();
    await page.getByRole("button", { name: "Save Routine" }).click();
    await expect(page.getByRole("heading", { name: "My Routine" })).toBeVisible();
  });
});

// ============================================================
// PERSONAL RECORDS
// ============================================================
test.describe("Personal Records", () => {
  test("shows records table", async ({ page }) => {
    await page.goto("/records");
    await expect(page.getByRole("heading", { name: "Best Lifts" })).toBeVisible();
    await expect(page.getByText("Bench Press").first()).toBeVisible();
  });

  test("muscle group filter works", async ({ page }) => {
    await page.goto("/records");
    await page.getByRole("button", { name: "Chest" }).click();
    await expect(page.getByText("Bench Press").first()).toBeVisible();
  });

  test("exercise search filter works", async ({ page }) => {
    await page.goto("/records");
    await page.getByPlaceholder("Search exercise...").fill("squat");
    await expect(page.getByText("Squat").first()).toBeVisible();
  });

  test("clear filters resets view", async ({ page }) => {
    await page.goto("/records");
    await page.getByRole("button", { name: "Chest" }).click();
    await page.getByText("Clear filters").click();
    await expect(page.getByText("Bench Press").first()).toBeVisible();
    await expect(page.getByText("Squat").first()).toBeVisible();
  });
});

// ============================================================
// END-TO-END FLOWS
// ============================================================
test.describe("End-to-End Flows", () => {
  test("create workout → view in list → delete", async ({ page }) => {
    await page.goto("/workouts/new");
    await page.getByPlaceholder("e.g. Upper Body Push").fill("E2E Test");
    await page.getByPlaceholder("Search exercises...").fill("Bench Press");
    await page.locator("ul li button").first().click();
    await page.getByPlaceholder("Reps").fill("8");
    await page.getByPlaceholder("Weight (lbs)").fill("185");
    await page.getByRole("button", { name: "Save Workout" }).click();

    await expect(page.getByRole("heading", { name: "E2E Test" })).toBeVisible();

    // Delete it
    await page.locator("button").filter({ has: page.locator("path[d*='14.74']") }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("heading", { name: "Workouts", exact: true })).toBeVisible();
  });

  test("create routine → start workout from it", async ({ page }) => {
    await page.goto("/routines/new");
    await page.getByPlaceholder("e.g. Push Day").fill("E2E Routine");
    await page.getByPlaceholder("Search exercises...").fill("Squat");
    await page.locator("ul li button").first().click();
    await page.getByRole("button", { name: "Save Routine" }).click();

    await expect(page.getByRole("heading", { name: "E2E Routine" })).toBeVisible();
    await page.getByText("Start Workout").click();
    await expect(page.getByText("From routine: E2E Routine")).toBeVisible();
  });
});
