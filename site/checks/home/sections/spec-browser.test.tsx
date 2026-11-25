// ail-derived-from: SpecBrowser@b624af26c019a2e6
import { afterEach, beforeEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SpecBrowser } from "../../../src/gen/home/sections/spec-browser";
import { specProjects } from "../../../src/gen/spec";

beforeEach(() => {
  if (typeof Element.prototype.scrollIntoView !== "function") {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
});

test("the demo's spec is shown first", () => {
  render(<SpecBrowser />);
  expect(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "tictactoe.ail.md" }).getAttribute("aria-pressed")).toBe("true");
  const region = screen.getByRole("region", { name: "Source of tictactoe.ail.md" });
  expect(region.textContent ?? "").toContain("node TicTacToe : system");
});

test("picking another file", () => {
  render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "board/board.ail.md" }));
  expect(screen.getByRole("button", { name: "board/board.ail.md" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "tictactoe.ail.md" }).getAttribute("aria-pressed")).not.toBe("true");
  const region = screen.getByRole("region", { name: "Source of board/board.ail.md" });
  expect(region.textContent ?? "").toContain("node BoardView : view");
});

test("showing this website's spec", () => {
  const site = specProjects.find((p) => p.key === "site");
  expect(site).toBeDefined();
  if (!site) return;
  const { container } = render(<SpecBrowser />);
  fireEvent.click(screen.getByRole("button", { name: "This website" }));
  expect(screen.getByRole("button", { name: "This website" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }).getAttribute("aria-pressed")).not.toBe("true");
  const firstPath = site.files[0].path;
  expect(screen.getByRole("button", { name: firstPath }).getAttribute("aria-pressed")).toBe("true");
  expect(container.textContent ?? "").toContain(`${site.nodeCount} nodes in ${site.files.length} files`);
});

test("opened from a link", () => {
  window.history.replaceState(null, "", "#spec/tictactoe/app/play/play.ail.md");
  act(() => {
    render(<SpecBrowser />);
  });
  expect(screen.getByRole("button", { name: "Tic-Tac-Toe demo" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "app/play/play.ail.md" }).getAttribute("aria-pressed")).toBe("true");
});

test("the language is defined", () => {
  const { container } = render(<SpecBrowser />);
  const section = container.querySelector("#specs");
  expect(section).not.toBeNull();
  if (!section) return;
  const link = within(section as HTMLElement).getByRole("link", { name: "the language definition" });
  expect(link.getAttribute("href")).toBe(
    "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md",
  );
});

test("following the same link twice", () => {
  window.history.replaceState(null, "", "#spec/tictactoe/app/play/play.ail.md");
  act(() => {
    render(
      <>
        <SpecBrowser />
        <a href="#spec/tictactoe/app/play/play.ail.md">Open play</a>
      </>,
    );
  });
  fireEvent.click(screen.getByRole("button", { name: "tictactoe.ail.md" }));
  expect(screen.getByRole("button", { name: "app/play/play.ail.md" }).getAttribute("aria-pressed")).not.toBe("true");
  act(() => {
    fireEvent.click(screen.getByRole("link", { name: "Open play" }));
  });
  expect(screen.getByRole("button", { name: "app/play/play.ail.md" }).getAttribute("aria-pressed")).toBe("true");
});
