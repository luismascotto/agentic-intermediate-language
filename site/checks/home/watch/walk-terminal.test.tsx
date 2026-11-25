// ail-derived-from: WalkTerminal@ddf54933680a8135
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { WalkTerminal } from "../../../src/gen/home/watch/walk-terminal";

afterEach(() => {
  cleanup();
});

test("lines kept exactly", () => {
  render(
    <WalkTerminal
      place="terminal · examples/tictactoe"
      lines={["$ ail build", "✓ spec     no errors"]}
      caret={false}
    />,
  );
  const region = screen.getByRole("region", { name: "Terminal output" });
  const lines = Array.from(region.children);
  expect(lines.length).toBe(2);
  expect(lines[0].textContent).toBe("$ ail build");
  expect(lines[1].textContent).toBe("✓ spec     no errors");
  const prompts = region.querySelectorAll('[data-part="prompt"]');
  expect(prompts.length).toBe(1);
  expect(prompts[0].textContent).toBe("$ ");
  expect(lines[0].contains(prompts[0])).toBe(true);
});

test("the caret", () => {
  const line = "· App: deriving checks from its scenarios";
  const { container } = render(
    <WalkTerminal place="terminal · examples/tictactoe" lines={[line]} caret={true} />,
  );
  const carets = container.querySelectorAll('[data-part="caret"]');
  expect(carets.length).toBe(1);
  const region = screen.getByRole("region", { name: "Terminal output" });
  const lines = Array.from(region.children);
  expect(lines.length).toBe(1);
  expect(lines[0].contains(carets[0])).toBe(true);
  expect(lines[0].lastElementChild).toBe(carets[0]);
  expect(lines[0].textContent).toBe(line);
});

test("nothing printed", () => {
  render(
    <WalkTerminal place="terminal · examples/tictactoe" lines={[]} caret={false} />,
  );
  expect(screen.getByText("Nothing is printed in this chapter.")).toBeTruthy();
});
