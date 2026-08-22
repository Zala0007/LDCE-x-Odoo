import { expect, test } from "@playwright/test";

test("landing page presents the trip planning journey", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GlobeTrotter/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /plan|start|explore/i }).first()).toBeVisible();
});

test("login page has usable authentication controls", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /your next story starts here/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /log in/i })).toBeEnabled();
});

test("signup page exposes the complete traveler profile form", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /make the world your own/i })).toBeVisible();
  await expect(page.getByLabel(/first name/i)).toBeVisible();
  await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /create my account/i })).toBeEnabled();
});
