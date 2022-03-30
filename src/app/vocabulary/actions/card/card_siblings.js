"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCardIdsWithSameTerm = exports.didAnySiblingCardsGetABadRatingInThisSession = exports.getAsCardInSession = exports.getSiblingCardsInSession = exports.getSiblingCards = void 0;
const card_1 = require("app/vocabulary/actions/card/card");
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const term_1 = require("app/vocabulary/actions/card/term");
const deck_1 = require("app/vocabulary/actions/deck");
const constants_1 = require("app/vocabulary/constants");
const underscore_1 = __importDefault(require("underscore"));
const getSiblingCards = (id) => {
    // return (this.siblingCardIds);
    return (0, exports.getAllCardIdsWithSameTerm)(id).filter((sibling_card_id) => sibling_card_id !== id);
};
exports.getSiblingCards = getSiblingCards;
const getSiblingCardsInSession = (id) => {
    return (0, exports.getSiblingCards)(id)
        .filter((card) => (0, card_1.isInSession)(card))
        .map((card) => (0, exports.getAsCardInSession)(card));
};
exports.getSiblingCardsInSession = getSiblingCardsInSession;
const getAsCardInSession = (id) => {
    return deck_1.deck.session.cards.find((card) => card.id === id);
};
exports.getAsCardInSession = getAsCardInSession;
const didAnySiblingCardsGetABadRatingInThisSession = (id) => {
    return (0, exports.getSiblingCards)(id).some((sibling_card_id) => {
        var _a;
        return (_a = (0, exports.getAsCardInSession)(sibling_card_id)) === null || _a === void 0 ? void 0 : _a.history.includes(constants_1.BAD);
    });
};
exports.didAnySiblingCardsGetABadRatingInThisSession = didAnySiblingCardsGetABadRatingInThisSession;
const getAllCardIdsWithSameTerm = (id) => {
    // return memoize(id, "getAllCardIdsWithSameTerm", () => {
    let out = [];
    (0, card_data_1.getTermIds)(id).forEach((term) => {
        out = out.concat((0, term_1.getCardIdsFromTermId)(term));
    });
    return underscore_1.default.uniq(out);
    // });
};
exports.getAllCardIdsWithSameTerm = getAllCardIdsWithSameTerm;
