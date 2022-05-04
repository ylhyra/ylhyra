import Session from "ylhyra/vocabulary/app/actions/session/index";

export function undo(this: Session) {
  const card = this.cardHistory?.[0];
  if (!card) return;
  card.history.shift();
  this.currentCard = card;
  this.cardHistory!.shift();
  this.lastUndid = this.counter;
  this.loadCardInInterface();
}

export function undoable(this: Session) {
  return (
    this.cardHistory &&
    this.cardHistory.length > 0 &&
    this.lastUndid !== this.counter
  );
}

export function checkForUndoOnKeyDown(this: Session, e: KeyboardEvent) {
  if (
    e.keyCode === 90 &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    this.undoable()
  ) {
    e.preventDefault();
    this.undo();
  }
}
