// ail-derived-from: WalkCaption@8af0ad844f655075
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkCaption } from "../../../src/gen/home/watch/walk-caption";

afterEach(() => {
  cleanup();
});

test("a branch chapter", () => {
  const { container } = render(
    <WalkCaption
      n={7}
      count={10}
      branch={true}
      title="Branch: the spec must decide"
      caption="Suppose only what had changed."
    />,
  );

  const strip = container.querySelector('[aria-live="polite"]');
  expect(strip).not.toBeNull();
  expect(strip?.textContent ?? "").toContain(
    "Chapter 7 of 10 · a branch off the main path",
  );

  const heading = screen.getByRole("heading", {
    level: 3,
    name: "Branch: the spec must decide",
  });
  expect(heading.textContent).toBe("Branch: the spec must decide");

  const caption = screen.getByText("Suppose only what had changed.");
  expect(
    heading.compareDocumentPosition(caption) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});
