"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplify = void 0;
const functions_1 = require("app/vocabulary/actions/functions");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const dependencies_1 = require("server/vocabulary/compile/dependencies");
const index_1 = require("server/vocabulary/compile/index");
const underscore_1 = __importDefault(require("underscore"));
const simplify = () => {
    /* Add sortkey for all items */
    let card_ids = Object.keys(index_1._deck.cards)
        .map((key) => {
        return index_1._deck.cards[key];
    })
        .sort((a, b) => a.level - b.level ||
        b.hasOwnProperty("sortKey") - a.hasOwnProperty("sortKey") ||
        a.sortKey - b.sortKey ||
        Boolean(b.sound) - Boolean(a.sound) ||
        (a.row_id % 100) - (b.row_id % 100) ||
        a.row_id - b.row_id)
        .map((card) => {
        return card.id;
    });
    // /* Run empty to remove cyclical dependencies */
    // withDependencies__backend(card_ids);
    // /* Run again now that  cyclical dependencies are gone */
    card_ids = (0, dependencies_1.withDependencies__backend)(card_ids);
    card_ids.forEach((card_id, index) => {
        index_1._deck.cards[card_id].sortKey = index;
        delete index_1._deck.cards[card_id].row_id;
    });
    Object.keys(index_1._deck.terms).forEach((term_id) => {
        const deps = (0, dependencies_1.CreateDependencyChain__backend)(term_id);
        // const directDependencies = Object.keys(deps).filter(
        //   (dep) => deps[dep] === 1
        // );
        /* The chain above isn't perfect and sometimes skips over values */
        let lowestDep = Infinity;
        Object.keys(deps).forEach((dep) => {
            lowestDep = Math.min(lowestDep, deps[dep]);
        });
        Object.keys(deps).forEach((dep) => {
            deps[dep] -= lowestDep - 1;
        });
        // if (term_id === getHash("einhver annar")) {
        //   Object.keys(deps).forEach((j) => {
        //     console.log({ word: printWord(j), userLevel: deps[j] });
        //   });
        //   console.log({ deps });
        // }
        // if (term_id === "1ydhbm") {
        //   console.log({ deps });
        // }
        // if (term_id === getHash("frá einhverjum öðrum - til einhvers annars")) {
        //   Object.keys(deps).forEach((j) => {
        //     console.log({ word: printWord(j), userLevel: deps[j] });
        //   });
        //   // console.log({ deps });
        // }
        // if (directDependencies.length > 0) {
        //   deck.terms[term_id].dependsOn = directDependencies;
        // }
        if (Object.keys(deps).length > 0) {
            // deck.terms[term_id].allDependencies = allDependencies;
            index_1._deck.terms[term_id].dependencies = deps;
        }
        if (Object.keys(deps).length > 30) {
            console.log(`very long deps for ${(0, functions_1.printWord)(term_id)}`);
            Object.keys(deps).forEach((j) => {
                console.log({ word: (0, functions_1.printWord)(j), level: deps[j] });
            });
        }
    });
    let terms = {};
    let cards = {};
    Object.keys(index_1._deck.terms).forEach((term_id) => {
        const term = index_1._deck.terms[term_id];
        let minSortKey;
        Object.keys(index_1._deck.cards[term.cards[0]]).forEach((key) => {
            if (key === "sortKey")
                return;
            if (key === "terms")
                return;
            const val = index_1._deck.cards[term.cards[0]][key];
            //tmp?
            if (key !== "terms" &&
                term.cards.every((card_id) => index_1._deck.cards[card_id].terms.length === 1 &&
                    key in index_1._deck.cards[card_id] &&
                    (0, json_stable_stringify_1.default)(sortIfArray(index_1._deck.cards[card_id][key])) ===
                        (0, json_stable_stringify_1.default)(sortIfArray(val)))) {
                term[key] = val;
                term.cards.forEach((card_id) => {
                    delete index_1._deck.cards[card_id][key];
                });
            }
            term.cards.forEach((card_id) => {
                cards[card_id] = index_1._deck.cards[card_id];
                minSortKey = Math.min(index_1._deck.cards[card_id].sortKey, minSortKey || Infinity);
            });
        });
        term.sortKey = minSortKey;
        terms[term_id] = term;
    });
    terms = sortObject(terms, "sortKey");
    cards = sortObject(cards, "sortKey");
    Object.keys(terms).forEach((term_id) => {
        // delete terms[term_id].sortKey;
    });
    Object.keys(cards).forEach((card_id) => {
        delete cards[card_id].id;
        delete cards[card_id].sortKey;
        delete cards[card_id].from;
        if (cards[card_id].terms.length === 1) {
            delete cards[card_id].terms;
        }
    });
    return {
        terms,
        cards,
    };
};
exports.simplify = simplify;
const sortObject = (obj, sortKey, replace) => {
    let out = {};
    Object.keys(obj)
        .sort((a, b) => obj[a][sortKey] - obj[b][sortKey])
        .forEach((k, index) => {
        out[k] = obj[k];
        if (replace) {
            out[k][sortKey] = index + 1;
        }
    });
    return out;
};
const sortIfArray = (val) => {
    if (Array.isArray(val)) {
        return underscore_1.default.sortBy(val, (i) => i);
    }
    return val;
};
