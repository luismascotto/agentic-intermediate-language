// ail-derived-from: ExperienceFigure@2bba690dcd4beaa9
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ExperienceFigure } from "../../../../src/gen/home/journey/stops/experience-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<ExperienceFigure />);
  const picture = screen.getByRole("img", {
    name: "Three frames: an empty board, X in the center, then O answers after 300 ms",
  });
  expect(picture).toBeTruthy();
  const text = picture.textContent ?? "";
  for (const expected of [
    "Given:",
    "vs computer",
    "When:",
    "X picks",
    "Then:",
    "O answers",
    "300 ms",
  ]) {
    expect(text).toContain(expected);
  }
});
