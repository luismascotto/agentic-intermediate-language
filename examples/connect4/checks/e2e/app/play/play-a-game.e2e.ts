// ail-derived-from: PlayAGame@seed
// End-to-end check for PlayAGame: its scenarios, played in a real browser
// against the running app at AIL_APP_URL.
import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const APP = process.env.AIL_APP_URL ?? "http://localhost:4175";
let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});
beforeEach(async () => {
  page = await browser.newPage();
  await page.goto(APP);
});

const column = (n: number) =>
  page.getByRole("button", { name: `Column ${n}` });
const drop = async (...cols: number[]) => {
  for (const c of cols) await column(c).click();
};
const status = (text: string) => page.getByText(text, { exact: true });

const proof = async (testName: string) => {
  const dir = process.env.AIL_SHOTS_DIR;
  if (dir) {
    await page.screenshot({
      path: join(
        dir,
        `${testName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 60) || "test"}.png`,
      ),
    });
  }
};

test("Red always starts", async () => {
  await expect(status("Red's turn").isVisible()).resolves.toBe(true);
  await proof("Red always starts");
});

test("taking turns", async () => {
  await drop(4);
  await expect(status("Yellow's turn").isVisible()).resolves.toBe(true);
  await proof("taking turns");
});

test("gravity stacks chips", async () => {
  await drop(4, 4);
  await expect(status("Red's turn").isVisible()).resolves.toBe(true);
  await proof("gravity stacks chips");
});

test("winning", async () => {
  await drop(1, 2, 1, 2, 1, 2, 1);
  await expect(status("Red wins!").isVisible()).resolves.toBe(true);
  await proof("winning");
});

test("new game", async () => {
  await drop(1, 2, 1, 2, 1, 2, 1);
  await page.getByRole("button", { name: "New game" }).click();
  await expect(status("Red's turn").isVisible()).resolves.toBe(true);
  await proof("new game");
});
