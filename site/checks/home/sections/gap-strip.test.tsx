// ail-derived-from: GapStrip@2e21dbf6168384ae
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { GapStrip } from "../../../src/gen/home/sections/gap-strip";

afterEach(() => {
  cleanup();
});

test("three cards", () => {
  const { container } = render(<GapStrip />);

  const heading = screen.getByRole("heading", {
    level: 2,
    name: "Between a prompt and the code, there is nothing to review.",
  });
  const eyebrow = screen.getByText("THE PROBLEM");
  expect(container.contains(eyebrow)).toBe(true);
  expect(container.contains(heading)).toBe(true);
  expect(
    eyebrow.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();

  const titles = screen
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  expect(titles).toEqual([
    "A prompt is too vague",
    "Code is too detailed",
    "AIL is the layer in between",
  ]);
});
