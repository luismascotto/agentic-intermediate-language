// ail-derived-from: WalkTitleBar@ee02dec26b68b4f6
import { afterEach, expect, mock, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { WalkTitleBar } from "../../../src/gen/home/watch/walk-title-bar";

afterEach(() => {
  cleanup();
});

test("the tabs", () => {
  const onPick = mock((_tab: "build" | "adopt") => {});
  const { container } = render(
    <WalkTitleBar tab="build" now="0:06" total="1:25" onPick={onPick} />,
  );
  const tablist = screen.getByRole("tablist", { name: "Walkthroughs" });
  const tabs = within(tablist).getAllByRole("tab");
  expect(tabs.length).toBe(2);
  expect(tabs[0]).toBe(within(tablist).getByRole("tab", { name: "ail build" }));
  expect(tabs[1]).toBe(within(tablist).getByRole("tab", { name: "ail adopt" }));
  expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  expect(tabs[1].getAttribute("aria-selected")).not.toBe("true");
  expect(container.textContent ?? "").toContain("0:06 / 1:25");
});

test("arrow keys", () => {
  const onPick = mock((_tab: "build" | "adopt") => {});
  render(<WalkTitleBar tab="build" now="0:06" total="1:25" onPick={onPick} />);
  const build = screen.getByRole("tab", { name: "ail build" });
  act(() => {
    build.focus();
  });
  expect(document.activeElement).toBe(build);
  fireEvent.keyDown(build, { key: "ArrowRight" });
  expect(onPick).toHaveBeenCalledTimes(1);
  expect(onPick.mock.calls[0][0]).toBe("adopt");
  expect(document.activeElement).toBe(screen.getByRole("tab", { name: "ail adopt" }));
});
