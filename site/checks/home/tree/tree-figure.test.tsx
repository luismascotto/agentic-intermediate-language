// ail-derived-from: TreeFigure@6112706bf63833cd
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { TreeFigure } from "../../../src/gen/home/tree/tree-figure";

afterEach(() => {
  cleanup();
});

const label =
  "The Tic-Tac-Toe spec as a tree: every node, with the path from TicTacToe through Engine down to ComputerPlayer highlighted";

const names = [
  "TicTacToe",
  "App",
  "PlayAGame",
  "NewGameButton",
  "ChooseOpponent",
  "WatchADemo",
  "BoardKit",
  "BoardView",
  "StatusLine",
  "Engine",
  "GameState",
  "Rules",
  "GameReducer",
  "ComputerPlayer",
  "UiKit",
  "Stack",
  "Text",
  "Button",
  "Segmented",
];

test("the picture", () => {
  render(<TreeFigure />);
  const images = screen.getAllByRole("img", { name: label });
  expect(images.length).toBeGreaterThan(0);
  for (const image of images) {
    for (const name of names) {
      expect(within(image).getAllByText(name).length).toBeGreaterThan(0);
    }
  }
});
