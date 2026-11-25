// ail-derived-from: ProofScreens@816dca00032768f2
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ProofScreens } from "../../../../src/gen/home/journey/stops/proof-screens";

afterEach(() => {
  cleanup();
});

test("the screens", () => {
  const { container } = render(<ProofScreens />);

  const winning = screen.getByRole("img", {
    name: "Screenshot at the end of the check “winning”",
  });
  const answers = screen.getByRole("img", {
    name: "Screenshot at the end of the check “the computer answers”",
  });

  const images = screen.getAllByRole("img");
  const winningIndex = images.indexOf(winning);
  const answersIndex = images.indexOf(answers);
  expect(winningIndex).toBeGreaterThanOrEqual(0);
  expect(answersIndex).toBeGreaterThanOrEqual(0);
  expect(winningIndex).toBeLessThan(answersIndex);

  expect(container.textContent ?? "").toContain("examples/tictactoe/checks/shots/");
});
