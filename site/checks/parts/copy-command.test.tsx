// ail-derived-from: CopyCommand@c6896a0be9537471
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CopyCommand } from "../../src/gen/parts/copy-command";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

afterEach(() => {
  cleanup();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  }
});

test("copying", async () => {
  let clipboardText = null as string | null;
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: (text: string): Promise<void> => {
        clipboardText = text;
        return Promise.resolve();
      },
    },
    configurable: true,
    writable: true,
  });

  render(<CopyCommand command="ail build" />);

  const button = screen.getByRole("button", { name: "Copy ail build" });

  await act(async () => {
    fireEvent.click(button);
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(clipboardText).toBe("ail build");
  expect(screen.getByRole("button", { name: "Copy ail build" }).textContent).toBe("Copied");

  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1600));
  });

  expect(screen.getByRole("button", { name: "Copy ail build" }).textContent).toBe("Copy");
}, 5000);
