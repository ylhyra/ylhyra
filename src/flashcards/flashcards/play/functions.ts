import { Rating } from "flashcards/flashcards/types";
import { useEffect } from "react";
import { CardUI } from "flashcards/flashcards/play/card";
import { checkForUndoOnKeyDown } from "flashcards/flashcards/actions/session/sessionHistory";

export const useKeyboardListener = (cardUi: CardUI) => {
  let isKeyDown: boolean = false;

  const checkKey = (e: KeyboardEvent) => {
    if (cardUi.isEditing) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isKeyDown) return;
    isKeyDown = true;

    const keyToResponse: Record<typeof e.code, Rating> = {
      Space: Rating.GOOD,
      Enter: Rating.GOOD,

      Digit1: Rating.BAD,
      Digit2: Rating.GOOD,
      Digit3: Rating.EASY,

      KeyJ: Rating.BAD,
      KeyK: Rating.GOOD,
      KeyL: Rating.EASY,

      KeyA: Rating.BAD,
      KeyS: Rating.GOOD,
      KeyD: Rating.EASY,

      ArrowLeft: Rating.BAD,
      ArrowDown: Rating.GOOD,
      ArrowRight: Rating.EASY,
    };

    if (e.code in keyToResponse) {
      cardUi.ratingClicked(keyToResponse[e.code], true);
      e.preventDefault();
    }
  };

  // todo: what about two keys down, one comes up?
  const keyUp = () => {
    isKeyDown = false;
  };

  useEffect(() => {
    window.addEventListener("keydown", checkKey);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("keydown", checkForUndoOnKeyDown);
    return () => {
      window.removeEventListener("keydown", checkKey);
      window.addEventListener("keyup", keyUp);
      window.removeEventListener("keydown", checkForUndoOnKeyDown);
    };
  }, []);
};
