// ail-derived-from: JourneyStop@1d3554cb5c168f86
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { JourneyStop } from "../../../src/gen/home/journey/journey-stop";

afterEach(() => {
  cleanup();
});

function normalize(text: string | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function elementsWithText(root: HTMLElement, text: string): Element[] {
  return Array.from(root.querySelectorAll("*")).filter(
    (el) => normalize(el.textContent) === text,
  );
}

test("a stop", () => {
  const { container } = render(
    <JourneyStop
      number={4}
      color="color.level.system"
      depth="depth 3"
      chip="SYSTEM"
      reader="engineers"
      headline="System level"
      explanation="Engineers decide how the parts fit together."
      lines={["4. The computer never loses."]}
      label="Spec excerpt"
      file="examples/tictactoe/tictactoe.ail.md"
      highlight={["never loses"]}
      turnsInto="Tests."
      figure={<div>figure</div>}
    />,
  );

  const article = container.querySelector("article#stop-4") as HTMLElement | null;
  expect(article).not.toBeNull();
  if (!article) return;

  expect(elementsWithText(article, "4").length).toBeGreaterThan(0);
  expect(elementsWithText(article, "SYSTEM").length).toBeGreaterThan(0);
  expect(elementsWithText(article, "Who reads this: engineers").length).toBeGreaterThan(0);

  const heading = within(article).getByRole("heading", { level: 3, name: "System level" });
  expect(heading).toBeTruthy();

  const region = within(article).getByRole("region", { name: "Spec excerpt" });
  expect(region).toBeTruthy();

  const turns = elementsWithText(article, "Turns into: Tests.");
  expect(turns.length).toBeGreaterThan(0);
  const turnsText = turns[0]?.textContent ?? "";
  const labelAt = turnsText.indexOf("Turns into:");
  const valueAt = turnsText.indexOf("Tests.");
  expect(labelAt).toBeGreaterThanOrEqual(0);
  expect(valueAt).toBeGreaterThan(labelAt);
});

test("a stop with a file to browse", () => {
  render(
    <JourneyStop
      number={2}
      color="color.level.experience"
      depth="depth 1"
      chip="EXPERIENCE"
      reader="designers"
      headline="Experience level"
      explanation="Designers describe what the player sees."
      lines={["The computer never loses."]}
      label="Spec excerpt"
      file="examples/tictactoe/ail-file.ail.md"
      highlight={["never loses"]}
      turnsInto="Screens."
      figure={<div>figure</div>}
      browse="#spec/tictactoe/ail-file.ail.md"
    />,
  );

  const link = screen.getByRole("link", {
    name: "Open the whole file in the spec browser ↓",
  });
  expect(link.getAttribute("href")).toBe("#spec/tictactoe/ail-file.ail.md");
});
