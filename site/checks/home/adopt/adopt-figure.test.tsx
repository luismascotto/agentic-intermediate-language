// ail-derived-from: AdoptFigure@306618e0234d52a1
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { AdoptFigure } from "../../../src/gen/home/adopt/adopt-figure";

afterEach(() => {
  cleanup();
});

test("the picture", () => {
  render(<AdoptFigure />);
  const images = screen.getAllByRole("img", {
    name: "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both",
  });
  expect(images.length).toBeGreaterThan(0);
  for (const image of images) {
    const text = image.textContent ?? "";
    expect(text).toContain("Your app today");
    expect(text).toContain("AIL spec");
    expect(text).toContain("Your app, rebuilt");
  }
});
