import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    // 跨裝置測試 (HO-613)
    {
      name: "iPad",
      use: { ...devices["iPad (gen 7)"] },
    },
    {
      name: "iPad landscape",
      use: { ...devices["iPad (gen 7) landscape"] },
    },
    {
      name: "iPhone 14",
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "Pixel 7 (Android)",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Desktop Safari",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
