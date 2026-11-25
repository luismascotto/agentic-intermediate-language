// ail-derived-from: WalkControls@56a6ccc4186cf1a6
import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WalkControls } from "../../../src/gen/home/watch/walk-controls";

afterEach(() => {
  cleanup();
});

test("on the first chapter", () => {
  render(
    <WalkControls
      mode="play"
      first={true}
      last={false}
      onPrevious={() => {}}
      onPlay={() => {}}
      onNext={() => {}}
    />,
  );
  const previous = screen.getByRole("button", { name: "Previous chapter" });
  const play = screen.getByRole("button", { name: "Play" });
  const next = screen.getByRole("button", { name: "Next chapter" });
  const buttons = screen.getAllByRole("button");
  expect(buttons.length).toBe(3);
  expect(buttons[0]).toBe(previous);
  expect(buttons[1]).toBe(play);
  expect(buttons[2]).toBe(next);
  expect((previous as HTMLButtonElement).disabled).toBe(true);
  expect((next as HTMLButtonElement).disabled).toBe(false);
});

test("moving on", () => {
  const onNext = mock(() => {});
  render(
    <WalkControls
      mode="pause"
      first={false}
      last={false}
      onPrevious={() => {}}
      onPlay={() => {}}
      onNext={onNext}
    />,
  );
  expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next chapter" }));
  expect(onNext).toHaveBeenCalledTimes(1);
});
