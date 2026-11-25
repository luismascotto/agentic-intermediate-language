// ail-derived-from: WalkPicture@c268106725103a6c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkPicture } from "../../../src/gen/home/watch/walk-picture";
import { NODES } from "../../../src/gen/home/watch/walkthrough/walkthrough";
import type {
  Beat,
  NodeState,
  Walkthrough,
} from "../../../src/gen/home/watch/walkthrough/walkthrough";

afterEach(() => {
  cleanup();
});

function beat(id: string, states: Record<string, NodeState>): Beat {
  return {
    id,
    title: id,
    caption: id,
    seconds: 10,
    branch: false,
    lines: [],
    states,
    inset: { kind: "none" },
  };
}

function boxOf(container: HTMLElement, name: string): Element {
  const box = container.querySelector(`g[data-node="${name}"]`);
  if (box === null) throw new Error(`no box for ${name}`);
  return box;
}

test("a stale chapter", () => {
  const walkthrough: Walkthrough = {
    command: "ail build",
    place: "terminal",
    picture: "Tic-Tac-Toe spec · 16 nodes",
    rest: "fresh",
    beats: [
      beat("start", {}),
      beat("stale", { App: "stale", WatchADemo: "stale" }),
    ],
  };
  const { container } = render(
    <WalkPicture walkthrough={walkthrough} chapter={1} />,
  );

  const meanings: Record<string, string> = {
    App: "out of date",
    WatchADemo: "out of date",
  };
  const nodes = NODES.map(
    (name) => `${name}: ${meanings[name] ?? "up to date"}`,
  ).join("; ");
  const label = `Tic-Tac-Toe spec · 16 nodes: ${nodes}`;
  expect(
    label.startsWith(
      "Tic-Tac-Toe spec · 16 nodes: TicTacToe: up to date; App: out of date; ",
    ),
  ).toBe(true);
  expect(screen.getByRole("img", { name: label })).toBeTruthy();

  expect(boxOf(container, "WatchADemo").textContent).toBe("WatchADemostale");
  expect(boxOf(container, "App").textContent).toBe("Appstale");
  expect(boxOf(container, "Rules").textContent).toBe("Rules✓ fresh");
});

test("nodes with no spec yet", () => {
  const walkthrough: Walkthrough = {
    command: "ail adopt",
    place: "terminal",
    picture: "Tic-Tac-Toe spec · 16 nodes",
    rest: "unwritten",
    beats: [beat("slice", { PlayAGame: "slice" })],
  };
  const { container } = render(
    <WalkPicture walkthrough={walkthrough} chapter={0} />,
  );

  expect(boxOf(container, "PlayAGame").textContent).toBe("PlayAGamethe slice");
  expect(boxOf(container, "App").textContent).toBe("App");

  const items = screen.getAllByRole("listitem");
  expect(items.some((li) => li.textContent === "no spec yet")).toBe(true);
});
