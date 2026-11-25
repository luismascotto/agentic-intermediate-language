import type { CSSProperties, ReactNode } from "react";
import { Stack } from "./stack";

type CodeBlockProps = {
  lines: string[];
  label: string;
  edge?: string;
  highlight?: string[];
  caption?: string;
};

type Segment = {
  text: string;
  start: number;
  end: number;
  marked: boolean;
};

const tokenVar = (name: string): string => `var(--${name.replace(/\./g, "-")})`;

const markStyle: CSSProperties = {
  background: "var(--color-thread-soft)",
  color: "var(--color-thread)",
  borderBottom: "1px solid var(--color-thread)",
  padding: "0 2px",
  borderRadius: "2px",
};

const firstWordStyle: CSSProperties = {
  wordBreak: "break-all",
};

const captionStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-text-muted)",
  overflowWrap: "anywhere",
};

const segmentsOf = (line: string, highlight: string[]): Segment[] => {
  const phrases = highlight.filter((p) => p.length > 0);
  const segments: Segment[] = [];
  let plainStart = 0;
  let i = 0;
  while (i < line.length) {
    const phrase = phrases.find((p) => line.startsWith(p, i));
    if (phrase === undefined) {
      i += 1;
      continue;
    }
    if (plainStart < i) {
      segments.push({ text: line.slice(plainStart, i), start: plainStart, end: i, marked: false });
    }
    segments.push({ text: phrase, start: i, end: i + phrase.length, marked: true });
    i += phrase.length;
    plainStart = i;
  }
  if (plainStart < line.length) {
    segments.push({ text: line.slice(plainStart), start: plainStart, end: line.length, marked: false });
  }
  return segments;
};

const renderSegment = (segment: Segment, key: string): ReactNode =>
  segment.marked ? (
    <mark key={key} style={markStyle}>
      {segment.text}
    </mark>
  ) : (
    segment.text
  );

const renderLine = (line: string, highlight: string[], index: number): ReactNode => {
  const leading = line.length - line.replace(/^ +/, "").length;
  const lineStyle: CSSProperties = {
    display: "block",
    paddingLeft: `${leading + 4}ch`,
    textIndent: `-${leading + 4}ch`,
  };
  if (line.length === 0) {
    return (
      <span key={index} style={lineStyle}>
        {" "}
      </span>
    );
  }
  const space = line.indexOf(" ", leading);
  let cut = space === -1 ? line.length : space;
  const prefix: ReactNode[] = [];
  const rest: ReactNode[] = [];
  segmentsOf(line, highlight).forEach((segment, j) => {
    if (segment.end <= cut) {
      prefix.push(renderSegment(segment, `p${j}`));
    } else if (segment.start < cut) {
      if (segment.marked) {
        prefix.push(renderSegment(segment, `p${j}`));
        cut = segment.end;
      } else {
        prefix.push(line.slice(segment.start, cut));
        rest.push(line.slice(cut, segment.end));
      }
    } else {
      rest.push(renderSegment(segment, `r${j}`));
    }
  });
  return (
    <span key={index} style={lineStyle}>
      <span style={firstWordStyle}>{prefix}</span>
      {rest}
    </span>
  );
};

/** shows the given lines exactly, one per line, keeping every space; an empty line stays an empty line */
export function CodeBlock({ lines, label, edge, highlight, caption }: CodeBlockProps) {
  const blockStyle: CSSProperties = {
    background: "var(--color-code)",
    color: "var(--color-code-text)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-code)",
    lineHeight: 1.6,
    padding: "clamp(12px, 3vw, 16px)",
    borderRadius: "var(--radius-md)",
    margin: 0,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    ...(edge !== undefined ? { borderLeft: `4px solid ${tokenVar(edge)}` } : {}),
  };
  const phrases = highlight ?? [];
  return (
    <Stack dir="v" gap="space.2" align="stretch">
      <pre role="region" aria-label={label} style={blockStyle}>
        {lines.map((line, index) => renderLine(line, phrases, index))}
      </pre>
      {caption !== undefined ? <div style={captionStyle}>{caption}</div> : null}
    </Stack>
  );
}
