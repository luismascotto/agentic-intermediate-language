// ail-derived-from: StatusLine@seed
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { StatusLine } from "../../src/gen/board/status-line";

afterEach(() => {
  cleanup();
});

function statusText(container: HTMLElement): string {
  const live = container.querySelector("[aria-live]");
  expect(live).not.toBeNull();
  return (live?.textContent ?? "").trim();
}

test("whose turn", () => {
  const { container } = render(
    <StatusLine status={{ kind: "playing" }} next="Y" />,
  );
  expect(statusText(container)).toBe("Yellow's turn");
});

test("a win", () => {
  const { container } = render(
    <StatusLine status={{ kind: "won", mark: "R", line: [35, 36, 37, 38] }} next="Y" />,
  );
  expect(statusText(container)).toBe("Red wins!");
});

test("a draw", () => {
  const { container } = render(
    <StatusLine status={{ kind: "draw" }} next="R" />,
  );
  expect(statusText(container)).toBe("It's a draw");
});
