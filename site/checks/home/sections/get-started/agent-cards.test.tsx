// ail-derived-from: AgentCards@6b6a5165fe1f4a3d
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen, within } from "@testing-library/react";
import { AgentCards } from "../../../../src/gen/home/sections/get-started/agent-cards";

afterEach(() => {
  cleanup();
});

test("in Cursor", () => {
  render(<AgentCards />);
  const command =
    "git clone https://github.com/ffMathy/agentic-intermediate-language ~/.cursor/plugins/local/ail";
  const card = screen.getByRole("region", { name: "In Cursor" });
  const text = card.textContent ?? "";
  expect(text).toContain(command);
  expect(
    within(card).getByRole("button", { name: `Copy ${command}` }),
  ).toBeTruthy();
  expect(text).toContain(
    "Then run Developer: Reload Window. Teams can import the repository as a team marketplace instead. The same skill, commands and hooks as in Claude Code.",
  );
});

test("in GitHub Copilot", () => {
  render(<AgentCards />);
  const first =
    "copilot plugin marketplace add ffMathy/agentic-intermediate-language";
  const second = "copilot plugin install ail@agentic-intermediate-language";
  const card = screen.getByRole("region", { name: "In GitHub Copilot" });
  const text = card.textContent ?? "";
  expect(text).toContain(first);
  expect(text).toContain(second);
  expect(text.indexOf(first)).toBeLessThan(text.indexOf(second));
  expect(
    within(card).getByRole("button", { name: `Copy ${first}` }),
  ).toBeTruthy();
  expect(
    within(card).getByRole("button", { name: `Copy ${second}` }),
  ).toBeTruthy();
  expect(text).toContain(
    "That's the Copilot CLI. In VS Code, add the same repository under chat.plugins.marketplaces and install ail from Agent Customizations.",
  );
});
