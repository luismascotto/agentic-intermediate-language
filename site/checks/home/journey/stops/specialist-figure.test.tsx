// ail-derived-from: SpecialistFigure@8139a06d5c028103
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecialistFigure } from "../../../../src/gen/home/journey/stops/specialist-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<SpecialistFigure />);
  const image = screen.getByRole("img", {
    name: "A tree of possible games: every ending is an O win or a draw, never an X win",
  });
  expect(image).toBeTruthy();
  const texts = Array.from(image.querySelectorAll("text")).map(
    (el) => el.textContent ?? "",
  );
  expect(texts).toContain("O wins");
  expect(texts).toContain("draw");
  expect(texts).toContain("X wins: never");
});
