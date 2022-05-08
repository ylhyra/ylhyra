import { getSession } from "flashcards/flashcards/sessionStore";
import { action } from "mobx";

export const undoSession = action(() => {
  const session = getSession();

  const card = session.cardHistory?.[0];
  if (!card) return;
  card.history.shift();
  session.currentCard = card;
  session.cardHistory!.shift();
  session.lastUndidAtCounter = session.counter;
});

export const isSessionUndoable = () => {
  const session = getSession();

  return (
    session.cardHistory &&
    session.cardHistory.length > 0 &&
    session.lastUndidAtCounter !== session.counter
  );
};

export const checkForUndoOnKeyDown = (e: KeyboardEvent) => {
  if (
    e.keyCode === 90 &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    isSessionUndoable()
  ) {
    e.preventDefault();
    undoSession();
  }
};
