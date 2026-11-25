// ail-derived-from: GetStarted@692dc1371772be13
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { GetStarted } from "../../../src/gen/home/sections/get-started";

afterEach(() => {
  cleanup();
});

function expectInOrder(elements: Element[]): void {
  for (let i = 1; i < elements.length; i += 1) {
    const position = elements[i - 1].compareDocumentPosition(elements[i]);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
}

test("in Claude Code", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In Claude Code" });
  const first = "/plugin marketplace add ffMathy/agentic-intermediate-language";
  const second = "/plugin install ail@agentic-intermediate-language";
  const text = card.textContent ?? "";
  expect(text).toContain(first);
  expect(text).toContain(second);
  const firstButton = within(card).getByRole("button", { name: `Copy ${first}` });
  const secondButton = within(card).getByRole("button", { name: `Copy ${second}` });
  expectInOrder([firstButton, secondButton]);
});

test("in a terminal", () => {
  render(<GetStarted />);
  const card = screen.getByRole("region", { name: "In a terminal" });
  const text = card.textContent ?? "";

  const install = "bun add -g github:ffMathy/agentic-intermediate-language";
  expect(text).toContain(install);
  const installButton = within(card).getByRole("button", { name: `Copy ${install}` });

  const table = within(card).getByRole("table");
  const rows = within(table)
    .getAllByRole("row")
    .filter((row) => within(row).queryAllByRole("cell").length > 0);
  const commands = rows.map((row) => {
    const cells = within(row).getAllByRole("cell");
    return (cells[0].textContent ?? "").trim();
  });
  expect(commands).toEqual(["ail build", "ail show [what]", "ail adopt"]);
  for (const row of rows) {
    const cells = within(row).getAllByRole("cell");
    expect(cells.length).toBeGreaterThanOrEqual(2);
    expect((cells[1].textContent ?? "").trim().length).toBeGreaterThan(0);
  }
  expectInOrder([installButton, table]);

  const where = within(card).getByText(
    "Run these inside a project, meaning any folder with an ail.config.json. To try the tic-tac-toe demo from this page:",
  );
  expectInOrder([table, where]);

  const steps = [
    "git clone https://github.com/ffMathy/agentic-intermediate-language",
    "cd agentic-intermediate-language && bun install && bun link",
    "cd examples/tictactoe && bun install && ail build",
    "ail show",
  ];
  for (const step of steps) {
    expect(text).toContain(step);
  }
  const stepButtons = steps.map((step) =>
    within(card).getByRole("button", { name: `Copy ${step}` }),
  );
  expectInOrder([where, ...stepButtons]);
});

test("what to do next", () => {
  render(<GetStarted />);
  const heading = screen.getByRole("heading", { level: 2, name: "Start in two minutes" });
  const lead = screen.getByText(
    "Install it, then describe a feature in plain words. You get a spec you can review, and code that is checked against it.",
  );
  expectInOrder([heading, lead]);

  const lastCard = screen.getByRole("region", { name: "In a terminal" });
  const example = screen.getByRole("link", { name: "Read the Tic-Tac-Toe spec" });
  const repo = screen.getByRole("link", { name: "View on GitHub ↗" });
  expect(example.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe",
  );
  expect(repo.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language",
  );
  expect(lastCard.contains(example)).toBe(false);
  expectInOrder([lastCard, example, repo]);
});
