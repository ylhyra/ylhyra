"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDependencies = void 0;
const card_dependencies_1 = require("app/vocabulary/actions/card/card_dependencies");
const functions_1 = require("app/vocabulary/actions/card/functions");
const term_1 = require("app/vocabulary/actions/card/term");
const underscore_1 = __importDefault(require("underscore"));
/**
 * Returns an array of cards with all
 * necessary dependencies of a card coming before it
 */
const withDependencies = (card_ids, options) => {
    let out = [];
    (0, functions_1.getTermIdsFromCardIds)(card_ids).forEach((term_id) => {
        let k = (0, card_dependencies_1.getSortedCardDependenciesAsCardIds)(term_id);
        /* Filter siblings, leaving dependencies */
        if (options === null || options === void 0 ? void 0 : options.skipSiblings) {
            k = k.filter((card_id) => !(0, term_1.getCardIds)(term_id).includes(card_id) || card_ids.includes(card_id));
        }
        out = out.concat(k);
    });
    return underscore_1.default.uniq(out);
};
exports.withDependencies = withDependencies;
