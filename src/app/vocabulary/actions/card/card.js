"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wasSeenInSession = exports.filterCardsThatExist = exports.doesCardExist = exports.isAllowed = exports.isInSession = exports.isIn = exports.clearMemoizations = void 0;
const card_dependencies_1 = require("app/vocabulary/actions/card/card_dependencies");
const deck_1 = require("app/vocabulary/actions/deck");
const clearMemoizations = (id) => {
    // ["isAllowed", "getTermLastSeen"].forEach((key) => {
    //   if (getMemoizeKey(key) in this) {
    //     delete getMemoizeKey(id, key)];
    //   }
    // });
};
exports.clearMemoizations = clearMemoizations;
// memoize(key, func) {
//   key = getMemoizeKey(key);
//   if (this[key] === undefined) {
//     this[key] = func.call(this);
//   }
//   return this[key];
// }
const isIn = (id, arrayOfCards) => {
    return arrayOfCards.some((s) => s === id);
};
exports.isIn = isIn;
const isInSession = (id) => {
    // TODO!!
    return (0, exports.isIn)(id, deck_1.deck.session.cards);
};
exports.isInSession = isInSession;
const isAllowed = (id) => {
    const { allowed_ids } = deck_1.deck.session;
    return (
    /* Ignore cards that are already in the session */
    !(0, exports.isInSession)(id) &&
        /* If allowed_ids is on, only select allowed cards */
        (!allowed_ids || allowed_ids.includes(id)) &&
        /* In case we're adding cards to an already ongoing session,
             ignore cards that are similar to a card the user has just seen */
        !deck_1.deck.session.cardHistory.slice(0, 3).some((card) => (0, card_dependencies_1.hasTermsInCommonWith)(id, card.getId()) ||
            (0, card_dependencies_1.hasDependenciesInCommonWith)(id, card.getId())
        // || isTextSimilarTo(id, card)
        ));
};
exports.isAllowed = isAllowed;
const doesCardExist = (id) => {
    return id in deck_1.deck.cards;
};
exports.doesCardExist = doesCardExist;
const filterCardsThatExist = (ids) => {
    return ids.filter(exports.doesCardExist);
};
exports.filterCardsThatExist = filterCardsThatExist;
const wasSeenInSession = (id) => {
    var _a;
    return (((_a = deck_1.deck.session.cards.find((card) => card.getId() === id)) === null || _a === void 0 ? void 0 : _a.history.length) > 0);
};
exports.wasSeenInSession = wasSeenInSession;
