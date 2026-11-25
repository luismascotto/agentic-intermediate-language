// ail-derived-from: Section@833319989183260c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { Section } from "../../src/gen/parts/section";

afterEach(() => {
  cleanup();
});

test("an anchored band", () => {
  render(
    <Section id="journey" tone="plain">
      Hello
    </Section>,
  );
  const band = document.getElementById("journey");
  expect(band).not.toBeNull();
  expect(band?.tagName.toLowerCase()).toBe("section");
  expect(band?.textContent ?? "").toContain("Hello");
});
