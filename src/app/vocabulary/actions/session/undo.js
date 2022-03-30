"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUndoOnKeyDown = exports.undoable = exports.undo = void 0;
/**
 * @memberOf Session#
 */
function undo() {
    const card = this.cardHistory[0];
    if (!card)
        return;
    card.history.shift();
    this.currentCard = card;
    this.cardHistory.shift();
    this.lastUndid = this.counter;
    this.loadCardInInterface();
}
exports.undo = undo;
/**
 * @memberOf Session#
 */
function undoable() {
    return this.cardHistory.length > 0 && this.lastUndid !== this.counter;
}
exports.undoable = undoable;
/**
 * @memberOf Session#
 */
function checkForUndoOnKeyDown(e) {
    if (e.keyCode === 90 &&
        (e.ctrlKey || e.metaKey) &&
        !e.altKey &&
        this.undoable()) {
        e.preventDefault();
        this.undo();
    }
}
exports.checkForUndoOnKeyDown = checkForUndoOnKeyDown;
