/**
 * @memberOf Session#
 */
export function undo() {
  const card = this.cardHistory[0];
  if (!card) return;
  card.history.shift();
  this.currentCard = card;
  this.cardHistory.shift();
  this.lastUndid = this.counter;
  this.loadCardInInterface();
}

/**
 * @memberOf Session#
 */
export function undoable() {
  return this.cardHistory.length > 0 && this.lastUndid !== this.counter;
}

/**
 * @memberOf Session#
 */
export function checkForUndoOnKeyDown(e) {
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
