"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextCard = void 0;
const isDev_1 = require("app/app/functions/isDev");
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const functions_1 = require("app/vocabulary/actions/functions");
const underscore_1 = __importDefault(require("underscore"));
let LOGGING;
// LOGGING = true;
/**
 * @memberOf Session#
 * @this Session
 */
function nextCard(depth = 0) {
    this.counter++;
    this.updateRemainingTime();
    if (this.done)
        return;
    if (this.cards.length === 0) {
        console.error("No cards");
        this.createMoreCards();
        /* Prevent infinite calls */
        if (depth === 0) {
            this.nextCard(1);
        }
        else {
            throw new Error("Failed to generate cards");
            // TODO User-facing error?
        }
        return;
    }
    else {
        this.checkIfCardsRemaining();
    }
    this.currentCard = underscore_1.default.min(this.cards, (i) => i.getRanking());
    /* Logging */
    if ((LOGGING || window["logging"]) && isDev_1.isDev) {
        const { deck } = this;
        console.table(underscore_1.default.sortBy(this.cards, (i) => i.getRanking()).map((i) => ({
            Rank: Math.round(i.getRanking()),
            Queue: i.absoluteQueuePosition - i.session.counter,
            Prohib: (i.cannotBeShownBefore || 0) - i.session.counter,
            seen: i.hasBeenSeenInSession() ? "SEEN" : "",
            word: (0, functions_1.printWord)(i.getId()),
            sortKey: i.getSortKey(),
            schdl: deck.schedule[i.getId()] ? new Date(i.getLastSeen()) : "",
        })));
    }
    /* Store when this term was last seen */
    (0, card_data_1.getTermIds)(this.currentCard.getId()).forEach((term_id) => {
        this.lastSeenTerms[term_id] = this.counter;
    });
    this.wasEasinessLevelJustIncreased = false;
    this.saveSessionInLocalStorage();
}
exports.nextCard = nextCard;
