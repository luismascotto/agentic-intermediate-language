// ail-derived-from: TreeSection@dba8b4d03670c3de
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { TreeSection } from "../../../src/gen/home/tree/tree-section";

afterEach(() => {
  cleanup();
});

test("the tree is explained", () => {
  const { container } = render(<TreeSection />);

  const section = container.querySelector("#tree");
  expect(section).not.toBeNull();
  const band = within(section as HTMLElement);

  expect(
    band.getByRole("heading", {
      level: 2,
      name: "A tree of tasks, the same all the way down",
    }),
  ).toBeTruthy();

  const h3Names = band
    .getAllByRole("heading", { level: 3 })
    .map((h) => (h.textContent ?? "").trim());
  const expected = [
    "One shape at every level",
    "Built one node at a time",
    "Checked node by node",
  ];
  const positions = expected.map((name) => h3Names.indexOf(name));
  for (const p of positions) {
    expect(p).toBeGreaterThanOrEqual(0);
  }
  expect(positions[0]).toBeLessThan(positions[1]);
  expect(positions[1]).toBeLessThan(positions[2]);

  const link = band.getByRole("link", {
    name: "Read the paper (arXiv:2512.24601) ↗",
  });
  expect(link.getAttribute("href")).toBe("https://arxiv.org/abs/2512.24601");
});
