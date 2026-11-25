// ail-derived-from: HeroFigure@1c6603f3cf594e6d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { HeroFigure } from "../../../src/gen/home/hero/hero-figure";

afterEach(() => {
  cleanup();
});

test("the picture is described", () => {
  render(<HeroFigure />);
  const figure = screen.getByRole("img", {
    name: "One sentence sinks through four levels of spec and comes out as code and a game board",
  });
  expect(figure).toBeTruthy();
  const text = figure.textContent ?? "";
  for (const expected of [
    "Tic-Tac-Toe.",
    "The computer never loses.",
    "Product",
    "Experience",
    "System",
    "Specialist",
  ]) {
    expect(text).toContain(expected);
  }
});
