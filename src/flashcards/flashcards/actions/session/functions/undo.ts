import { getSession } from "flashcards/flashcards/actions/session/session";
import { action } from "mobx";

export const undoSession = action(() => {
  const session = getSession();

  const card = session.history.cardHistory?.[0];
  if (!card) return;
  card.history.shift();
  session.currentCard = card;
  session.history.cardHistory!.shift();
  session.history.lastUndidAtCounter = session.counter;
});

export const isSessionUndoable = () => {
  const session = getSession();

  return (
    session.history.cardHistory &&
    session.history.cardHistory.length > 0 &&
    session.history.lastUndidAtCounter !== session.counter
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
