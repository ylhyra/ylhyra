"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCardsIntoSession = void 0;
const cardInSession_1 = __importDefault(require("app/vocabulary/actions/cardInSession"));
/**
 * Used to load more cards into an already ongoing session.
 * Called from createCards.
 * @memberOf Session#
 */
function loadCardsIntoSession(card_ids, options = {}) {
    let insertAtPosition = 0;
    if (!options.insertImmediately) {
        /* Insert new cards after the current cards */
        insertAtPosition = this.cards.filter((i) => !i.done).length;
        if (insertAtPosition) {
            insertAtPosition += 200;
        }
    }
    card_ids.forEach((id, index) => {
        this.cards.push(new cardInSession_1.default({
            id,
            insertAtPosition: insertAtPosition + index,
            session: this,
        }));
    });
}
exports.loadCardsIntoSession = loadCardsIntoSession;
