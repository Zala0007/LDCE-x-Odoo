import { spawn } from "node:child_process";
import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const root = process.cwd();
const output = path.join(root, "docs", "assets", "screenshots");
const origin = "http://localhost:3100";
await mkdir(output, { recursive: true });
await mkdir(path.join(root, ".next", "standalone", ".next"), {
  recursive: true,
});
await cp(
  path.join(root, ".next", "static"),
  path.join(root, ".next", "standalone", ".next", "static"),
  { recursive: true, force: true },
);

const db = new PrismaClient();
const trip = await db.trip.findFirstOrThrow({
  where: {
    owner: { email: "he.demo@globetrotter.local" },
    name: "Japan Spring Stories",
  },
  include: { publicLink: true },
});
await db.$disconnect();

const server = spawn(
  process.execPath,
  [path.join(root, ".next", "standalone", "server.js")],
  {
    cwd: root,
    env: { ...process.env, HOSTNAME: "localhost", PORT: "3100" },
    stdio: "ignore",
  },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Documentation server did not become ready.");
}

const browser = await chromium.launch();
try {
  await waitForServer();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`${origin}/login`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(output, "login.png"),
    fullPage: false,
  });
  await page.goto(`${origin}/signup`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(output, "registration.png"),
    fullPage: false,
  });
  await page.goto(`${origin}/login`);
  await page.getByLabel("Email address").fill("he.demo@globetrotter.local");
  await page.getByLabel("Password").fill("DemoTravel2027");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/trips|\/dashboard/);

  const pages = [
    ["dashboard", "/dashboard"],
    ["explore", "/explore"],
    ["my-trips", "/trips"],
    ["new-trip", "/trips/new"],
    ["itinerary", `/trips/${trip.id}`],
    ["builder", `/trips/${trip.id}/builder`],
    ["budget", `/trips/${trip.id}/budget`],
    ["calendar", `/trips/${trip.id}/calendar`],
    ["sharing", `/trips/${trip.id}/share`],
    ["community", "/community"],
    ["profile", "/profile"],
    ["admin", "/admin"],
  ];
  for (const [name, route] of pages) {
    await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: path.join(output, `${name}.png`),
      fullPage: false,
    });
  }
  await page.goto(`${origin}/profile`, { waitUntil: "networkidle" });
  await page.locator(".profile-trips").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(output, "profile-trips.png"),
    fullPage: false,
  });
  await context.close();

  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const publicPage = await publicContext.newPage();
  await publicPage.goto(`${origin}/share/${trip.publicLink.slug}`, {
    waitUntil: "networkidle",
  });
  await publicPage.evaluate(() => window.scrollTo(0, 0));
  await publicPage.screenshot({
    path: path.join(output, "public-itinerary.png"),
    fullPage: false,
  });
  await publicContext.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${origin}/login`);
  await mobilePage
    .getByLabel("Email address")
    .fill("he.demo@globetrotter.local");
  await mobilePage.getByLabel("Password").fill("DemoTravel2027");
  await mobilePage.getByRole("button", { name: "Log in" }).click();
  await mobilePage.waitForURL(/\/trips|\/dashboard/);
  await mobilePage.goto(`${origin}/dashboard`, { waitUntil: "networkidle" });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.screenshot({
    path: path.join(output, "dashboard-mobile.png"),
    fullPage: false,
  });
  await mobile.close();

  console.log(`Captured ${pages.length + 5} screenshots in ${output}.`);
} finally {
  await browser.close();
  server.kill("SIGTERM");
}
