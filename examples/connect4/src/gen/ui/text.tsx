import type { CSSProperties, ReactNode } from "react";

export type TextProps = {
  variant: "status" | "mark" | "body";
  color?: string;
  align?: "start" | "center";
  live?: "polite";
  children: ReactNode;
};

const variantStyles: Record<TextProps["variant"], CSSProperties> = {
  status: {
    fontSize: "var(--font-status)",
    fontWeight: 600,
    color: "var(--color-text)",
  },
  mark: {
    fontSize: "var(--font-mark)",
    fontWeight: 800,
    lineHeight: 1,
  },
  body: {
    fontSize: "var(--font-body)",
    color: "var(--color-text)",
  },
};

/** shows its content as a block, in the status, mark or body style */
export function Text({ variant, color, align, live, children }: TextProps) {
  const style: CSSProperties = {
    display: "block",
    ...variantStyles[variant],
    ...(color !== undefined
      ? { color: `var(--${color.split(".").join("-")})` }
      : {}),
    ...(align !== undefined ? { textAlign: align } : {}),
  };
  return (
    <span style={style} aria-live={live}>
      {children}
    </span>
  );
}
