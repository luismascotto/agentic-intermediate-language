import { Button } from "../../ui/button";

export type NewGameButtonProps = {
  onPress: () => void;
};

/** When the player presses "New game" Then a new game is asked for, once */
export function NewGameButton({ onPress }: NewGameButtonProps) {
  return (
    <Button variant="secondary" onPress={onPress}>
      New game
    </Button>
  );
}
