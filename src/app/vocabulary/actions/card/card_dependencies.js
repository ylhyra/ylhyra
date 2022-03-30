"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortedCardDependenciesAsCardIds = exports.getSortedTermDependencies = exports.hasDependenciesInCommonWith = exports.hasTermsInCommonWith = exports.dependencyDepthOfCard = exports.getDependenciesAsArrayOfCardIds = exports.getDependenciesAsCardIdToDepth = exports.termGetDependenciesAsTermIdToDepth = exports.getDependenciesAsTermIdToDepth = void 0;
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const functions_1 = require("app/vocabulary/actions/card/functions");
const term_1 = require("app/vocabulary/actions/card/term");
const deck_1 = require("app/vocabulary/actions/deck");
const underscore_1 = __importDefault(require("underscore"));
const getDependenciesAsTermIdToDepth = (id) => {
    const term_id = (0, card_data_1.getTermIds)(id)[0];
    return (0, exports.termGetDependenciesAsTermIdToDepth)(term_id);
};
exports.getDependenciesAsTermIdToDepth = getDependenciesAsTermIdToDepth;
const termGetDependenciesAsTermIdToDepth = (term_id) => {
    return Object.assign(Object.assign({}, (deck_1.deck.terms[term_id].dependencies || {})), { [term_id]: 0 });
};
exports.termGetDependenciesAsTermIdToDepth = termGetDependenciesAsTermIdToDepth;
const getDependenciesAsCardIdToDepth = (id) => {
    let out = {};
    const deps = (0, exports.getDependenciesAsTermIdToDepth)(id);
    Object.keys(deps).forEach((term_id) => {
        (0, term_1.getCardIdsFromTermId)(term_id).forEach((card_id) => {
            out[card_id] = deps[term_id];
        });
    });
    return out;
};
exports.getDependenciesAsCardIdToDepth = getDependenciesAsCardIdToDepth;
const getDependenciesAsArrayOfCardIds = (id) => {
    return (0, functions_1.getCardIdsFromTermIds)(Object.keys((0, exports.getDependenciesAsTermIdToDepth)(id))).filter((card_id) => card_id !== id);
};
exports.getDependenciesAsArrayOfCardIds = getDependenciesAsArrayOfCardIds;
const dependencyDepthOfCard = (id, card2) => {
    return (0, exports.getDependenciesAsCardIdToDepth)(id)[card2];
};
exports.dependencyDepthOfCard = dependencyDepthOfCard;
const hasTermsInCommonWith = (id, card2) => {
    return underscore_1.default.intersection((0, card_data_1.getTermIds)(id), (0, card_data_1.getTermIds)(card2)).length > 0;
};
exports.hasTermsInCommonWith = hasTermsInCommonWith;
const hasDependenciesInCommonWith = (id, card2) => {
    const x2 = (0, exports.getDependenciesAsArrayOfCardIds)(card2);
    return (0, exports.getDependenciesAsArrayOfCardIds)(id).some((card_id) => x2.includes(card_id));
};
exports.hasDependenciesInCommonWith = hasDependenciesInCommonWith;
const getSortedTermDependencies = (term_id) => {
    const dependenciesAsTermIdToDepth = (0, exports.termGetDependenciesAsTermIdToDepth)(term_id);
    let term_ids = Object.keys(dependenciesAsTermIdToDepth).sort((a, b) => dependenciesAsTermIdToDepth[b] - dependenciesAsTermIdToDepth[a]);
    // if (options?.onlyDirect) {
    //   term_ids = term_ids.filter((a) => dependenciesAsTermIdToDepth[a] <= 1);
    // }
    return term_ids;
};
exports.getSortedTermDependencies = getSortedTermDependencies;
const getSortedCardDependenciesAsCardIds = (term_id) => {
    return underscore_1.default.uniq(underscore_1.default.flatten((0, exports.getSortedTermDependencies)(term_id).map((term) => (0, term_1.getCardIdsShuffledIfSeen)(term))));
};
exports.getSortedCardDependenciesAsCardIds = getSortedCardDependenciesAsCardIds;
