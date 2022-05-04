import { loadCardInInterface } from "flashcards/flashcards/play/actions/session/loadCardInInterface";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";

export function undoSession() {
  const session = getSession();

  const card = session.cardHistory?.[0];
  if (!card) return;
  card.history.shift();
  session.currentCard = card;
  session.cardHistory!.shift();
  session.lastUndid = session.counter;
  loadCardInInterface();
}

export function isSessionUndoable() {
  const session = getSession();

  return (
    session.cardHistory &&
    session.cardHistory.length > 0 &&
    session.lastUndid !== session.counter
  );
}

export function checkForUndoOnKeyDown(e: KeyboardEvent) {
  if (
    e.keyCode === 90 &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    isSessionUndoable()
  ) {
    e.preventDefault();
    undoSession();
  }
}
