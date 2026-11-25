// ail-derived-from: AdoptSection@0e3ae409730c3ca3
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { AdoptSection } from "../../../src/gen/home/adopt/adopt-section";

afterEach(() => {
  cleanup();
});

test("adopting is explained", () => {
  const { container } = render(<AdoptSection />);

  const section = container.querySelector("#adopt");
  expect(section).not.toBeNull();
  const scope = within(section as HTMLElement);

  expect(
    scope.getByRole("heading", { level: 2, name: "Already have an app? Adopt it." }),
  ).toBeTruthy();

  const expected = [
    "Why, from people and tickets",
    "What, from the running app",
    "How, from the code",
    "Proof, on the old app",
  ];
  for (const name of expected) {
    expect(scope.getByRole("heading", { level: 3, name })).toBeTruthy();
  }
  const h3Texts = scope
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim())
    .filter((t) => expected.includes(t));
  expect(h3Texts).toEqual(expected);

  expect(scope.getAllByText("/ail:adopt").length).toBeGreaterThan(0);
  expect(scope.getAllByText("ail adopt").length).toBeGreaterThan(0);
});
