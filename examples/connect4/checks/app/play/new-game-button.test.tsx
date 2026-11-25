// ail-derived-from: NewGameButton@seed
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NewGameButton } from "../../../src/gen/app/play/new-game-button";

afterEach(() => {
  cleanup();
});

test("pressing it", () => {
  const onPress = mock(() => {});
  render(<NewGameButton onPress={onPress} />);
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
