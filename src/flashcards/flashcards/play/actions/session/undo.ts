export function undo("flashcards/app/store") {
  const card = this.cardHistory?.[0];
  if (!card) return;
  card.history.shift();
  this.currentCard = card;
  this.cardHistory!.shift();
  this.lastUndid = this.counter;
  this.loadCardInInterface();
}

export function undoable("flashcards/app/store") {
  return (
    this.cardHistory &&
    this.cardHistory.length > 0 &&
    this.lastUndid !== this.counter
  );
}

export function checkForUndoOnKeyDown(e: KeyboardEvent) {
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
