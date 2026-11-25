// ail-derived-from: Readers@5695d6bb7e3b4be4
import { afterEach, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Readers } from "../../../src/gen/home/readers/readers";

afterEach(() => {
  cleanup();
});

test("the first reader", () => {
  render(<Readers />);
  const stakeholder = screen.getByRole("tab", { name: "Stakeholder" });
  expect(stakeholder.getAttribute("aria-selected")).toBe("true");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("PRODUCT LEVEL");
});

test("picking another reader", () => {
  render(<Readers />);
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  fireEvent.click(specialist);
  expect(screen.getByRole("tab", { name: "Specialist" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tab", { name: "Stakeholder" }).getAttribute("aria-selected")).toBe("false");
  const panel = screen.getByRole("tabpanel");
  expect(panel.textContent ?? "").toContain("SPECIALIST LEVEL");
});

test("arrow keys", () => {
  render(<Readers />);
  const stakeholder = screen.getByRole("tab", { name: "Stakeholder" });
  act(() => {
    stakeholder.focus();
  });
  expect(document.activeElement).toBe(stakeholder);
  fireEvent.keyDown(stakeholder, { key: "ArrowLeft" });
  const specialist = screen.getByRole("tab", { name: "Specialist" });
  expect(specialist.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(specialist);
});
