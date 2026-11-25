// ail-derived-from: SpecEditor@ba315163c0a68bed
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { SpecEditor } from "../../src/gen/parts/spec-editor";

afterEach(() => {
  cleanup();
});

test("readable before the editor loads", () => {
  render(
    <SpecEditor
      text="node A : fn   level: system"
      path="a.ail.md"
      label="Source of a.ail.md"
    />,
  );
  const region = screen.getByRole("region", { name: "Source of a.ail.md" });
  expect(region.textContent ?? "").toContain("node A : fn   level: system");
});
