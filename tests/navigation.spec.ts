import { test, expect } from "@playwright/test";

test("homepage loads with dashboard title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("navigate to workouts page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Workouts" }).first().click();
  await expect(page.getByRole("heading", { name: "Workouts" })).toBeVisible();
});

test("navigate to records page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Records" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Personal Records" })
  ).toBeVisible();
});

test("navigate to new workout form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Log Workout" }).first().click();
  await expect(
    page.getByRole("heading", { name: "Log Workout" })
  ).toBeVisible();
});

test("seed workouts appear on dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Upper Body Push")).toBeVisible();
  await expect(page.getByText("Leg Day")).toBeVisible();
});
