// ail-derived-from: CodeBlock@b7f01c903a7cbbfa
import { afterEach, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CodeBlock } from "../../src/gen/parts/code-block";

afterEach(() => {
  cleanup();
});

function lineSpans(region: HTMLElement): HTMLElement[] {
  return Array.from(region.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el.tagName === "SPAN",
  );
}

test("shown exactly", () => {
  render(<CodeBlock lines={["a  b", "  c"]} label="Sample" />);
  const region = screen.getByRole("region", { name: "Sample" });
  const spans = lineSpans(region);
  expect(spans.length).toBe(2);
  expect(spans[0].textContent).toBe("a  b");
  expect(spans[1].textContent).toBe("  c");
  for (const span of spans) {
    expect(span.style.display).toBe("block");
  }
  expect(region.textContent).toBe("a  b  c");
});

test("the thread is marked", () => {
  render(
    <CodeBlock
      lines={["4. The computer never loses.", "5. New game"]}
      label="Sample"
      highlight={["never loses"]}
    />,
  );
  const region = screen.getByRole("region", { name: "Sample" });
  const marks = Array.from(region.querySelectorAll("mark"));
  expect(marks.length).toBe(1);
  expect(marks[0].textContent).toBe("never loses");
});

test("a caption", () => {
  render(
    <CodeBlock
      lines={["a"]}
      label="Sample"
      caption="examples/tictactoe/tictactoe.ail.md"
    />,
  );
  const region = screen.getByRole("region", { name: "Sample" });
  const caption = screen.getByText("examples/tictactoe/tictactoe.ail.md");
  expect(region.contains(caption)).toBe(false);
  expect(
    region.compareDocumentPosition(caption) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("a long line wraps under itself", () => {
  const line =
    "    because an instant answer feels like the player's own move did nothing";
  render(
    <div style={{ width: "30ch" }}>
      <CodeBlock lines={[line]} label="Sample" />
    </div>,
  );
  const region = screen.getByRole("region", { name: "Sample" });
  expect(region.textContent).toBe(line);
  expect(region.style.whiteSpace).toBe("pre-wrap");
  expect(region.style.getPropertyValue("overflow-wrap")).toBe("anywhere");
  const hiding = ["auto", "scroll", "hidden", "clip"];
  expect(hiding).not.toContain(region.style.overflow);
  expect(hiding).not.toContain(region.style.overflowX);
  const spans = lineSpans(region);
  expect(spans.length).toBe(1);
  expect(spans[0].textContent).toBe(line);
  expect(spans[0].style.paddingLeft).toBe("8ch");
  expect(spans[0].style.textIndent).toBe("-8ch");
});
