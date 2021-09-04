/**
 * @module Session
 */
export function undo() {
  const card = this.cardHistory[0];
  if (!card) return;
  card.history.shift();
  this.currentCard = card;
  this.cardHistory.shift();
  this.lastUndid = this.counter;
  this.loadCard();
}
/**
 * @module Session
 */
export function undoable() {
  // if (!(this.lastUndid !== this.counter)) {
  //   console.warn("Unmatching counter");
  // }
  return this.cardHistory.length > 0 && this.lastUndid !== this.counter;
}
/**
 * @module Session
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
