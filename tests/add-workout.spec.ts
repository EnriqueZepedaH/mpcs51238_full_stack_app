import { test, expect } from "@playwright/test";

test("add a new workout via form", async ({ page }) => {
  await page.goto("/workouts/new");

  await page.getByPlaceholder("e.g. Upper Body Push").fill("Test Workout");
  await page.getByPlaceholder("Exercise name").fill("Bench Press");
  await page.getByPlaceholder("Reps").fill("10");
  await page.getByPlaceholder("Weight (lbs)").fill("135");

  await page.getByRole("button", { name: "Save Workout" }).click();

  // Should redirect to the workout detail page
  await expect(
    page.getByRole("heading", { name: "Test Workout" })
  ).toBeVisible();
  await expect(page.getByText("Bench Press")).toBeVisible();
  await expect(page.getByText("135 lbs")).toBeVisible();
});

test("new workout appears in workouts list", async ({ page }) => {
  await page.goto("/workouts/new");

  await page.getByPlaceholder("e.g. Upper Body Push").fill("My New Session");
  await page.getByPlaceholder("Exercise name").fill("Squat");
  await page.getByPlaceholder("Reps").fill("5");
  await page.getByPlaceholder("Weight (lbs)").fill("225");

  await page.getByRole("button", { name: "Save Workout" }).click();
  await expect(
    page.getByRole("heading", { name: "My New Session" })
  ).toBeVisible();

  // Navigate to workouts list
  await page.getByRole("link", { name: "Workouts" }).first().click();
  await expect(page.getByText("My New Session")).toBeVisible();
});
