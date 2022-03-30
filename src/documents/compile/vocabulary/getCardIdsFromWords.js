"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardIdsFromWords = void 0;
const deck_1 = require("app/vocabulary/actions/deck");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const underscore_1 = __importDefault(require("underscore"));
const getCardIdsFromWords = (words, returnMissing) => {
    let missing = [];
    let card_ids = [];
    words.forEach((word) => {
        if (!word)
            return;
        const hash = (0, functions_1.getHash)(word.split(" = ")[0]);
        if (hash in deck_1.deck.terms) {
            card_ids = card_ids.concat(deck_1.deck.terms[hash].cards);
        }
        else if (hash in deck_1.deck.alternative_ids) {
            deck_1.deck.alternative_ids[hash].forEach((j) => {
                var _a;
                card_ids = card_ids.concat(((_a = deck_1.deck.terms[j]) === null || _a === void 0 ? void 0 : _a.cards) || []);
            });
        }
        else {
            missing.push(word);
        }
    });
    if (returnMissing) {
        return missing;
    }
    return underscore_1.default.uniq(card_ids);
};
exports.getCardIdsFromWords = getCardIdsFromWords;
