import type { CSSProperties, ReactNode } from "react";

const shape: CSSProperties = {
  borderRadius: "var(--radius-md)",
  padding: "var(--space-2) var(--space-4)",
  fontSize: "var(--font-body)",
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
};

const variants: Record<"primary" | "secondary", CSSProperties> = {
  primary: {
    background: "var(--color-action)",
    color: "var(--color-action-text)",
    border: "1px solid var(--color-action)",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  },
};

/** a native button that runs its action once each time it is pressed */
export function Button({
  variant,
  onPress,
  children,
}: {
  variant: "primary" | "secondary";
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      style={{ ...shape, ...variants[variant] }}
      onClick={() => onPress()}
    >
      {children}
    </button>
  );
}
