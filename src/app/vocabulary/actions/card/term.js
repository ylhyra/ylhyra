"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardIdsShuffledIfSeen = exports.getCardIdsFromTermId = exports.getCardIds = exports.getTermData = void 0;
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const deck_1 = require("app/vocabulary/actions/deck");
const getTermData = (term_id) => {
    return deck_1.deck.terms[term_id];
};
exports.getTermData = getTermData;
const getCardIds = (term_id) => {
    return (0, exports.getTermData)(term_id).cards;
};
exports.getCardIds = getCardIds;
exports.getCardIdsFromTermId = exports.getCardIds;
const getCardIdsShuffledIfSeen = (term_id) => {
    if ((0, exports.getCardIds)(term_id).some((card_id) => (0, card_schedule_1.isInSchedule)(card_id)) &&
        Math.random() > 0.5) {
        return (0, exports.getCardIds)(term_id).reverse();
    }
    else {
        return (0, exports.getCardIds)(term_id);
    }
};
exports.getCardIdsShuffledIfSeen = getCardIdsShuffledIfSeen;
