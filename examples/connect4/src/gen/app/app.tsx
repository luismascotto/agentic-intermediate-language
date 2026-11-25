import { PlayAGame } from "./play/play-a-game";
import { Stack } from "../ui/stack";

/** One place to play Connect 4 on this device. */
export function App() {
  return (
    <Stack
      dir="v"
      gap="space.4"
      align="stretch"
      pad="space.6"
      style={{
        maxWidth: "420px",
        marginLeft: "auto",
        marginRight: "auto",
        background: "var(--color-surface)",
      }}
    >
      <PlayAGame />
    </Stack>
  );
}
