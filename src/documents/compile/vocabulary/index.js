"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVocabularyList = void 0;
const functions_1 = require("app/vocabulary/actions/card/functions");
const deck_1 = require("app/vocabulary/actions/deck");
const functions_2 = require("app/vocabulary/actions/functions");
const dependencies_1 = require("app/vocabulary/actions/functions/dependencies");
const getCardIdsFromWords_1 = require("documents/compile/vocabulary/getCardIdsFromWords");
const initializeDeckFromFile_1 = require("documents/compile/vocabulary/initializeDeckFromFile");
const underscore_1 = __importDefault(require("underscore"));
const parseVocabularyList = (vocabulary_list) => {
    if (!vocabulary_list)
        return;
    if (!deck_1.deck)
        (0, initializeDeckFromFile_1.initializeDeckFromFile)();
    const card_ids = (0, getCardIdsFromWords_1.getCardIdsFromWords)(vocabulary_list).filter((id) => id in deck_1.deck.cards);
    // const missing = getCardIdsFromWords(vocabulary_list, true);
    const terms = (0, functions_1.getTermIdsFromCardIds)(card_ids);
    const dependencyTerms = (0, functions_1.getTermIdsFromCardIds)(underscore_1.default.difference((0, dependencies_1.withDependencies)(card_ids), card_ids));
    if (terms.length === 0)
        return null;
    const sentences = underscore_1.default.uniq(underscore_1.default.flatten(terms
        .map((term_id) => {
        var _a;
        return (_a = (0, functions_2.printWord)(term_id)) === null || _a === void 0 ? void 0 : _a.split(/;+ /g);
    })
        .filter(Boolean)));
    const cards = (0, functions_1.getCardIdsFromTermIds)(terms);
    const dependencyCards = (0, functions_1.getCardIdsFromTermIds)(dependencyTerms);
    let out = {
        terms,
        dependencyTerms,
        cards,
        dependencyCards,
        sentences,
    };
    // if (missing) {
    //   out.missing = missing;
    // }
    return out;
};
exports.parseVocabularyList = parseVocabularyList;
