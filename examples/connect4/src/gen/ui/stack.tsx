import type { CSSProperties, ReactNode } from "react";

export type StackProps = {
  dir: "v" | "h";
  gap?: string;
  align?: "start" | "center" | "end" | "stretch";
  pad?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const tokenVar = (token: string): string => `var(--${token.split(".").join("-")})`;

const alignItems = (align: StackProps["align"]): CSSProperties["alignItems"] => {
  if (align === "start") return "flex-start";
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  return "stretch";
};

/** lays out its children in a column or a row, in the order given, with an even gap between them */
export function Stack({ dir, gap, align, pad, style, children }: StackProps) {
  const base: CSSProperties = {
    display: "flex",
    flexDirection: dir === "v" ? "column" : "row",
    alignItems: alignItems(align),
  };
  if (gap !== undefined) base.gap = tokenVar(gap);
  if (pad !== undefined) base.padding = tokenVar(pad);
  return <div style={{ ...base, ...style }}>{children}</div>;
}
