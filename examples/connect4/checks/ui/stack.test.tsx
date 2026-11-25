// ail-derived-from: Stack@seed
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Stack } from "../../src/gen/ui/stack";

afterEach(() => {
  cleanup();
});

test("children keep their order", () => {
  render(
    <Stack dir="v">
      <span>a</span>
      <span>b</span>
      <span>c</span>
    </Stack>,
  );
  const items = screen.getAllByText(/^[abc]$/);
  expect(items.map((el) => el.textContent)).toEqual(["a", "b", "c"]);
});
