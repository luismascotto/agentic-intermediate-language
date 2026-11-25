// ail-derived-from: WalkthroughPlayer@d583804d16a9a4fa
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WalkthroughPlayer } from "../../../src/gen/home/watch/walkthrough-player";
import { BUILD } from "../../../src/gen/home/watch/walkthrough/build-walkthrough";

afterEach(() => {
  cleanup();
});

function playerText(): string {
  return screen.getByRole("region", { name: "Walkthrough player" }).textContent ?? "";
}

function liveText(container: HTMLElement): string {
  return Array.from(container.querySelectorAll("[aria-live]"))
    .map((el) => el.textContent ?? "")
    .join("\n");
}

function terminalText(): string {
  return screen.getByRole("region", { name: "Terminal output" }).textContent ?? "";
}

test("it opens paused", () => {
  const { container } = render(<WalkthroughPlayer />);
  expect(screen.getByRole("tab", { name: "ail build" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("heading", { level: 3, name: "The spec changes, not code" })).toBeTruthy();
  expect(liveText(container)).toContain("Chapter 1 of 10");
  expect(terminalText()).toContain("$ ail build");
  expect(playerText()).toContain("0:06 / 1:25");
  expect(screen.getByRole("button", { name: "Play the walkthrough (1:25)" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
});

test("the other walkthrough", () => {
  render(<WalkthroughPlayer />);
  fireEvent.click(screen.getByRole("tab", { name: "ail adopt" }));
  expect(screen.getByRole("tab", { name: "ail adopt" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tab", { name: "ail build" }).getAttribute("aria-selected")).toBe("false");
  expect(screen.getByRole("heading", { level: 3, name: "An old app, no spec" })).toBeTruthy();
  expect(playerText()).toContain("0:06 / 1:38");
});

test("picking a chapter", () => {
  render(<WalkthroughPlayer />);
  fireEvent.click(screen.getByRole("button", { name: "Chapter 3: Checks written once, then pinned" }));
  expect(screen.getByRole("heading", { level: 3, name: "Checks written once, then pinned" })).toBeTruthy();
  expect(
    screen
      .getByRole("button", { name: "Chapter 3: Checks written once, then pinned" })
      .getAttribute("aria-current"),
  ).toBe("step");
  const lines = BUILD.beats[2].lines;
  expect(lines.length).toBe(4);
  expect(lines[0]).toBe("· App: deriving checks from its scenarios");
  const text = terminalText();
  for (const line of lines) {
    expect(text).toContain(line);
  }
  expect(text.indexOf(lines[0])).toBeLessThan(text.indexOf(lines[1]));
  fireEvent.click(screen.getByRole("button", { name: "Chapter 10: Everything checks out" }));
  expect((screen.getByRole("button", { name: "Next chapter" }) as HTMLButtonElement).disabled).toBe(true);
});

test("next and previous", () => {
  render(<WalkthroughPlayer />);
  expect((screen.getByRole("button", { name: "Previous chapter" }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Next chapter" }));
  expect(screen.getByRole("heading", { level: 3, name: "What is out of date" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Previous chapter" }));
  expect(screen.getByRole("heading", { level: 3, name: "The spec changes, not code" })).toBeTruthy();
});

test("arrow keys", () => {
  render(<WalkthroughPlayer />);
  const build = screen.getByRole("tab", { name: "ail build" });
  act(() => {
    build.focus();
  });
  fireEvent.keyDown(build, { key: "ArrowRight" });
  const adopt = screen.getByRole("tab", { name: "ail adopt" });
  expect(adopt.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(adopt);
  fireEvent.keyDown(adopt, { key: "ArrowLeft" });
  const buildAgain = screen.getByRole("tab", { name: "ail build" });
  expect(buildAgain.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(buildAgain);
});

test("playing", async () => {
  render(<WalkthroughPlayer />);
  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Play the walkthrough (1:25)" })).toBeNull();
  expect(playerText()).toContain("0:00 / 1:25");
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  });
  expect(playerText()).toContain("0:01 / 1:25");
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
});
