// ail-derived-from: Hero@5a8e445c83ed5ea2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Hero } from "../../../src/gen/home/hero/hero";

afterEach(() => {
  cleanup();
});

test("the links go to the right places", () => {
  render(<Hero />);
  expect(
    screen.getByRole("link", { name: "Follow the sentence ↓" }).getAttribute("href"),
  ).toBe("#journey");
  expect(
    screen.getByRole("link", { name: "Try to beat the computer ↓" }).getAttribute("href"),
  ).toBe("#stop-8");
  expect(
    screen.getByRole("link", { name: "View on GitHub ↗" }).getAttribute("href"),
  ).toBe("https://github.com/ffMathy/agentic-intermediate-language");
});
