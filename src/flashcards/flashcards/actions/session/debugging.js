"use strict";
exports.__esModule = true;
exports.debugSession = void 0;
var session_1 = require("flashcards/flashcards/actions/session/session");
var underscore_1 = require("underscore");
/**
 * Used to see all cards currently loaded in a session.
 * In your browser console, set:
 *    logging = true
 * and every time a new card is loaded, a table will be printed.
 */
var debugSession = function () {
    var session = (0, session_1.getSession)();
    if (globalThis.logging) {
        /** Sort by ranking */
        var cards = underscore_1["default"].sortBy(session.cards, function (card) {
            return card.getRanking();
        });
        console.table(cards.map(function (card) { return ({
            Rank: Math.round(card.getRanking()),
            Queue: card.absoluteQueuePosition - session.counter,
            notShowBfr: (card.cannotBeShownBefore || 0) - session.counter,
            seen: card.hasBeenSeenInSession() ? "SEEN" : "",
            word: card.printWord(),
            sortKey: card.getSortKey()
        }); }));
    }
};
exports.debugSession = debugSession;
