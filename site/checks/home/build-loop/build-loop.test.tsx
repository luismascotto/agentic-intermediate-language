// ail-derived-from: BuildLoop@331123fce1169613
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { BuildLoop } from "../../../src/gen/home/build-loop/build-loop";

afterEach(() => {
  cleanup();
});

test("four steps", () => {
  const { container } = render(<BuildLoop />);
  const section = container.querySelector("section#loop");
  expect(section).not.toBeNull();
  const loop = section as HTMLElement;

  const items = within(loop).getAllByRole("listitem");
  expect(items.length).toBe(4);
  const titles = items.map((item) =>
    within(item).getByRole("heading", { level: 3 }).textContent?.trim(),
  );
  expect(titles).toEqual(["Write", "Build", "Check", "Ask"]);

  const text = loop.textContent ?? "";
  expect(text).toContain("Example question.");
  expect(text).toContain("(see the GameReducer node)");
});
