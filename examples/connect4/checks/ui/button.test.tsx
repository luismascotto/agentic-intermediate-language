// ail-derived-from: Button@seed
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button } from "../../src/gen/ui/button";

afterEach(() => {
  cleanup();
});

test("pressing", () => {
  const onPress = mock(() => {});
  render(
    <Button variant="primary" onPress={onPress}>
      New game
    </Button>,
  );
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
