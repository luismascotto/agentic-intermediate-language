import type { Mark, Status } from "../engine/game-state";
import { Text } from "../ui/text";

const playerName: Record<Mark, string> = {
  R: "Red",
  Y: "Yellow",
};

/** shows exactly one message: whose turn it is, who won, or that it's a draw */
export function StatusLine({ status, next }: { status: Status; next: Mark }) {
  if (status.kind === "draw") {
    return (
      <Text variant="status" align="center" live="polite">
        {"It's a draw"}
      </Text>
    );
  }
  const player: Mark = status.kind === "won" ? status.mark : next;
  const playerPart = (
    <span
      style={{
        color: player === "R" ? "var(--color-player-r)" : "var(--color-player-y)",
      }}
    >
      {playerName[player]}
    </span>
  );
  return (
    <Text variant="status" align="center" live="polite">
      {playerPart}
      {status.kind === "won" ? " wins!" : "'s turn"}
    </Text>
  );
}
