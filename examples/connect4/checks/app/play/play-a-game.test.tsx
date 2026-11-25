// ail-derived-from: PlayAGame@seed
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { PlayAGame } from "../../../src/gen/app/play/play-a-game";

afterEach(() => {
  cleanup();
});

function columns(): HTMLButtonElement[] {
  const grid = screen.getByRole("grid");
  const buttons = within(grid).getAllByRole("button") as HTMLButtonElement[];
  expect(buttons.length).toBe(7);
  return buttons;
}

function statusText(): string {
  const el = document.querySelector("[aria-live]");
  expect(el).not.toBeNull();
  return (el?.textContent ?? "").trim();
}

function drop(column: number): void {
  fireEvent.click(columns()[column]!);
}

function hasMark(el: HTMLElement, mark: "R" | "Y"): boolean {
  return (el.textContent ?? "").includes(mark);
}

test("Red always starts", () => {
  render(<PlayAGame />);
  expect(statusText()).toBe("Red's turn");
});

test("taking turns", () => {
  render(<PlayAGame />);
  drop(3);
  expect(hasMark(columns()[3]!, "R")).toBe(true);
  expect(statusText()).toBe("Yellow's turn");
});

test("gravity stacks chips", () => {
  render(<PlayAGame />);
  drop(3);
  const afterRed = columns()[3]!.textContent ?? "";
  expect(hasMark(columns()[3]!, "R")).toBe(true);
  drop(3);
  const afterYellow = columns()[3]!.textContent ?? "";
  expect(afterYellow.length).toBeGreaterThan(afterRed.length);
  expect(hasMark(columns()[3]!, "Y")).toBe(true);
  expect(statusText()).toBe("Red's turn");
});

test("a full column can't be picked", () => {
  render(<PlayAGame />);
  for (let i = 0; i < 6; i++) drop(0);
  const before = columns()[0]!.textContent;
  const statusBefore = statusText();
  drop(0);
  expect(columns()[0]!.textContent).toBe(before);
  expect(statusText()).toBe(statusBefore);
});

test("winning", () => {
  render(<PlayAGame />);
  // R vertical in column 0: R,Y,R,Y,R,Y,R
  drop(0);
  drop(1);
  drop(0);
  drop(1);
  drop(0);
  drop(1);
  drop(0);
  expect(statusText()).toBe("Red wins!");
  for (const button of columns()) {
    expect(button.disabled).toBe(true);
  }
});

test("new game", () => {
  render(<PlayAGame />);
  drop(0);
  drop(1);
  drop(0);
  drop(1);
  drop(0);
  drop(1);
  drop(0);
  fireEvent.click(screen.getByRole("button", { name: "New game" }));
  expect(statusText()).toBe("Red's turn");
  for (const button of columns()) {
    expect(button.disabled).toBe(false);
    expect(button.textContent ?? "").not.toMatch(/[RY]/);
  }
});
