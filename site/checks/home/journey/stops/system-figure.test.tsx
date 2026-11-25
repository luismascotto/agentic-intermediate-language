// ail-derived-from: SystemFigure@5f445eb750202046
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SystemFigure } from "../../../../src/gen/home/journey/stops/system-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<SystemFigure />);
  const image = screen.getByRole("img", {
    name: "A board goes into the one rule and comes out as won, draw or playing",
  });
  expect(image).toBeTruthy();
  const text = image.textContent ?? "";
  expect(text).toContain("won · X");
  expect(text).toContain("draw");
  expect(text).toContain("playing");
});
