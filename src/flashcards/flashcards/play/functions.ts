import { Rating } from "flashcards/flashcards/types";
import { useEffect } from "react";

export const useKeyboardListener = () => {
  let isKeyDown: boolean = false;

  const checkKey = (e: KeyboardEvent) => {
    if (this.state.isEditing) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isKeyDown) return;
    const answered = this.state.isShowingBottomSide;
    isKeyDown = true;
    if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
      if (answered) {
        this.ratingClicked(Rating.GOOD);
      } else {
        this.cardClicked();
      }
      e.preventDefault();
    } else if (
      [49 /* One */, 74 /* J */, 65 /* A */, 37 /* Left */].includes(e.keyCode)
    ) {
      if (answered) {
        this.ratingClicked(Rating.BAD);
      } else {
        this.cardClicked();
      }
      e.preventDefault();
    } else if (
      [50 /* Two */, 75 /* K */, 83 /* S */, 40 /* Down */].includes(e.keyCode)
    ) {
      if (answered) {
        this.ratingClicked(Rating.GOOD);
      } else {
        this.cardClicked();
      }
      e.preventDefault();
    } else if (
      [51 /* Three */, 76 /* L */, 68 /* D */, 39 /* Right */].includes(
        e.keyCode,
      )
    ) {
      if (answered) {
        this.ratingClicked(Rating.EASY);
      } else {
        this.cardClicked();
      }
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
    return () => {
      window.removeEventListener("keydown", checkKey);
      window.addEventListener("keyup", keyUp);
    };
  }, []);
};
