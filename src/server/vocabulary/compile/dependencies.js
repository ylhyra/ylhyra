"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDependencyChain__backend = exports.withDependencies__backend = void 0;
const index_1 = require("server/vocabulary/compile/index");
const underscore_1 = __importDefault(require("underscore"));
const withDependencies__backend = (card_ids, options) => {
    const showDepth = options === null || options === void 0 ? void 0 : options.showDepth;
    let returns = [];
    let terms = [];
    let depth = {};
    if (typeof card_ids === "string") {
        card_ids = [card_ids];
    }
    card_ids
        .filter((card_id) => card_id in index_1._deck.cards)
        .forEach((card_id) => (terms = terms.concat(index_1._deck.cards[card_id].terms)));
    terms = underscore_1.default.uniq(terms);
    terms.forEach((term) => {
        let terms = [{ term, dependencySortKey: 0 }];
        const chain = (0, exports.CreateDependencyChain__backend)(term);
        // console.log(
        //   Object.keys(chain).map((j) => {
        //     return [printWord(j), chain[j]];
        //   })
        // );
        Object.keys(chain).forEach((k) => {
            terms.push({ term: k, dependencySortKey: chain[k] });
        });
        terms = terms.sort((a, b) => b.dependencySortKey - a.dependencySortKey); //.map((i) => i.term);
        terms.forEach((obj) => {
            term = obj.term;
            [term, ...(index_1._deck.alternative_ids[term] || [])].forEach((j) => {
                if (j in index_1._deck.terms) {
                    let card_ids = index_1._deck.terms[j].cards;
                    // if (card_ids.some((id) => id in deck.schedule)) {
                    //   card_ids = _.shuffle(card_ids);
                    // } else {
                    card_ids = card_ids.sort((a) => {
                        if (a.endsWith("is"))
                            return -1;
                        return 1;
                    });
                    // }
                    returns = returns.concat(card_ids);
                    index_1._deck.terms[j].cards.forEach((card_id) => {
                        depth[card_id] = Math.max(depth[card_id] || 0, obj.dependencySortKey);
                    });
                }
            });
        });
    });
    const out = underscore_1.default.uniq(returns).filter((card_id) => card_id in index_1._deck.cards);
    if (showDepth) {
        let k = {};
        out.forEach((card_id) => {
            k[card_id] = depth[card_id];
        });
        return k;
    }
    else {
        return out;
    }
};
exports.withDependencies__backend = withDependencies__backend;
/**
 * Returns an object on the form { [key]: [depth] }
 */
const CreateDependencyChain__backend = (from_term, _alreadySeenDirectParents = [], output = {}, depth = 1, type = "deep" // or "shallow"
) => {
    if (from_term in index_1._deck.dependencies) {
        index_1._deck.dependencies[from_term].forEach((term) => {
            if (!term)
                return;
            /* Deep copy in order to only watch direct parents */
            const alreadySeenDirectParents = [..._alreadySeenDirectParents];
            if (alreadySeenDirectParents.includes(term)) {
                // DeleteDependency(from_term, term);
                return;
            }
            alreadySeenDirectParents.push(term);
            // if (from_term === "1ydhbm") {
            //   console.log({
            //     depth,
            //     output,
            //     term,
            //   });
            // }
            if (type === "shallow") {
                output[term] = Math.min(output[term] || 100, depth);
            }
            else if (type === "deep") {
                output[term] = Math.max(output[term] || 0, depth);
            }
            [
                term,
                /* Through alternative ids */
                ...(index_1._deck.alternative_ids[term] || []),
            ]
                .filter(Boolean)
                .forEach((j) => {
                const isThroughAltId = j !== term;
                (0, exports.CreateDependencyChain__backend)(j, alreadySeenDirectParents, output, depth + (isThroughAltId ? 0 : 1), type);
            });
        });
    }
    return output;
};
exports.CreateDependencyChain__backend = CreateDependencyChain__backend;
