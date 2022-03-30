"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rememoizeCards = exports.getCardByText = exports.getTermIdsFromCardIds = exports.getCardIdsFromTermIds = void 0;
const time_1 = require("app/app/functions/time");
const term_1 = require("app/vocabulary/actions/card/term");
const deck_1 = require("app/vocabulary/actions/deck");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const underscore_1 = require("underscore");
const card_data_1 = require("./card_data");
const getCardIdsFromTermIds = (term_ids) => {
    return (0, underscore_1.uniq)((0, underscore_1.flatten)(term_ids.map((t) => (0, term_1.getCardIds)(t)).filter(Boolean)));
};
exports.getCardIdsFromTermIds = getCardIdsFromTermIds;
const getTermIdsFromCardIds = (ids) => {
    return (0, underscore_1.uniq)((0, underscore_1.flatten)(ids.map((id) => (0, card_data_1.getTermIds)(id))));
};
exports.getTermIdsFromCardIds = getTermIdsFromCardIds;
const getCardByText = (text) => {
    return deck_1.deck.cards[(0, functions_1.getHash)(text) + "_is"];
};
exports.getCardByText = getCardByText;
const rememoizeCards = () => {
    // deck.cards_sorted.forEach((card) => {
    //   card.clearMemoizations();
    // });
    (0, time_1.clearTimeMemoized)();
};
exports.rememoizeCards = rememoizeCards;
