// ail-derived-from: Text@seed
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Text } from "../../src/gen/ui/text";

afterEach(() => {
  cleanup();
});

test("content is shown", () => {
  const { container } = render(<Text variant="status">Red wins!</Text>);
  expect(screen.getByText("Red wins!")).toBeTruthy();
  expect(container.textContent).toBe("Red wins!");
});
