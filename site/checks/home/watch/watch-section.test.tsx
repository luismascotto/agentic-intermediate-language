// ail-derived-from: WatchSection@4aff1e1022df567c
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, within } from "@testing-library/react";
import { WatchSection } from "../../../src/gen/home/watch/watch-section";

afterEach(() => {
  cleanup();
});

test("the section", () => {
  const { container } = render(<WatchSection />);
  const section = container.querySelector("#watch");
  expect(section).not.toBeNull();
  const band = section as HTMLElement;
  const heading = within(band).getByRole("heading", {
    level: 2,
    name: "Watch AIL build, and adopt",
  });
  expect(heading).toBeTruthy();
  const eyebrow = within(band).getByText("SEE IT RUN");
  expect(eyebrow).toBeTruthy();
  const position = eyebrow.compareDocumentPosition(heading);
  expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
