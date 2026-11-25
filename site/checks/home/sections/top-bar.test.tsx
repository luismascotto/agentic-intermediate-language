// ail-derived-from: TopBar@279c2a5bb355891f
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { TopBar } from "../../../src/gen/home/sections/top-bar";

afterEach(() => {
  cleanup();
});

test("the links lead to the right places", () => {
  render(<TopBar />);
  const nav = screen.getByRole("navigation", { name: "Sections" });
  const links = within(nav).getAllByRole("link");
  expect(links.map((link) => link.textContent)).toEqual([
    "The journey",
    "Watch it work",
    "Four readers",
    "How it builds",
    "Adopt an app",
    "Browse the specs",
    "Get started",
    "GitHub ↗",
  ]);
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "#journey",
    "#watch",
    "#readers",
    "#loop",
    "#adopt",
    "#specs",
    "#start",
    "https://github.com/ffMathy/agentic-intermediate-language",
  ]);
});
