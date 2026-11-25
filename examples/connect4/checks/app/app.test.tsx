// ail-derived-from: App@seed
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { App } from "../../src/gen/app/app";

afterEach(() => {
  cleanup();
});

function statusText(container: HTMLElement): string {
  const live = container.querySelector("[aria-live]");
  expect(live).not.toBeNull();
  return (live?.textContent ?? "").replace(/\s+/g, " ").trim();
}

test("opening the app", () => {
  const { container } = render(<App />);
  expect(statusText(container)).toBe("Red's turn");
  const cells = container.querySelectorAll("[role='gridcell']");
  expect(cells.length).toBe(42);
  for (const cell of cells) {
    expect((cell.textContent ?? "").trim()).toBe("");
  }
});
