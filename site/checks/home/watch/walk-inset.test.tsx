// ail-derived-from: WalkInset@73099075182b77fc
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkInset } from "../../../src/gen/home/watch/walk-inset";
import type { Inset } from "../../../src/gen/home/watch/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

function isBefore(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

test("a card", () => {
  const inset: Inset = {
    kind: "card",
    label: "Compile context: WatchADemo",
    lines: ["Target, design tokens, glossary", "Why chain: TicTacToe → App"],
  };
  render(<WalkInset inset={inset} />);
  const label = screen.getByText("Compile context: WatchADemo");
  const first = screen.getByText("Target, design tokens, glossary");
  const second = screen.getByText("Why chain: TicTacToe → App");
  expect(first).not.toBe(second);
  expect(first.contains(second)).toBe(false);
  expect(second.contains(first)).toBe(false);
  expect(isBefore(label, first)).toBe(true);
  expect(isBefore(first, second)).toBe(true);
});

test("a screenshot", () => {
  const inset: Inset = {
    kind: "shot",
    node: "PlayAGame",
    test: "winning",
    label: "Your app today · localhost:3000",
    verdict: "MATCHES",
  };
  render(<WalkInset inset={inset} />);
  const image = screen.getByRole("img", {
    name: "Screenshot of the app at the end of the check “winning”",
  });
  const label = screen.getByText("Your app today · localhost:3000");
  const verdict = screen.getByText("MATCHES");
  expect(isBefore(label, image)).toBe(true);
  expect(isBefore(verdict, image)).toBe(true);
});

test("nothing", () => {
  const inset: Inset = { kind: "none" };
  const { container } = render(<WalkInset inset={inset} />);
  expect(container.childNodes.length).toBe(0);
  expect(container.textContent).toBe("");
});
