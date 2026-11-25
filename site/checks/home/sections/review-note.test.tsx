// ail-derived-from: ReviewNote@cda90e5354fcd224
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ReviewNote } from "../../../src/gen/home/sections/review-note";

afterEach(() => {
  cleanup();
});

test("generated code stays out of review", () => {
  render(<ReviewNote />);
  const region = screen.getByRole("region", {
    name: "Review the spec, not the generated code",
  });
  const text = region.textContent ?? "";
  expect(text).toContain("src/gen/** linguist-generated=true");
  expect(text).toContain("ail.lock.json linguist-generated=true");
});
