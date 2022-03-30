"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relevant_BIN_domains = exports.get_label_for_BIN_inflection_form = exports.get_label_for_BIN_word = void 0;
const classification_1 = require("inflection/tables/classification/classification");
const tree_1 = require("inflection/tables/tree");
/**
 *  Turns BÍN's classifications into English
 *
 * @param {object} input
 *   Input is a raw row from the database with
 *   original values from the KRISTINsnid.csv file.
 *   The parameter mapping from the original file is
 *   shown in "server/server-with-database/database/ImportToDatabase.js".
 *   The following attributes of the input object are taken into consideration:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *
 * @returns {object|array}
 *   Returns the inputted object with the following keys removed:
 *   - word_categories
 *   - grammatical_tag
 *   - BIN_domain
 *   And the following keys added:
 *   - word_categories - An array of values that
 *     apply to all the forms of the word (a noun, adjective...)
 *   - inflectional_form_categories - An array of
 *     values that only apply to certain forms of the word (plurality, case...)
 */
const classify = (input) => {
    let { word_categories, grammatical_tag, BIN_domain } = input, rest = __rest(input, ["word_categories", "grammatical_tag", "BIN_domain"]);
    if (!word_categories && !grammatical_tag)
        return input;
    /* Word categories */
    word_categories = (word_categories === null || word_categories === void 0 ? void 0 : word_categories.toLowerCase()) || "";
    let word_categories_output = (0, exports.get_label_for_BIN_word)(word_categories).split(", ");
    if (exports.relevant_BIN_domains[BIN_domain]) {
        word_categories_output.push(exports.relevant_BIN_domains[BIN_domain]);
    }
    let inflectional_form_categories = [];
    let original_grammatical_tag = grammatical_tag;
    grammatical_tag = (grammatical_tag === null || grammatical_tag === void 0 ? void 0 : grammatical_tag.toLowerCase()) || "";
    /* Adjectives: Arrange plurality before gender */
    grammatical_tag = grammatical_tag.replace(/(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/i, "$3-$1-$2");
    /* Nouns: Arrange plurality before case */
    grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/i, "$2-$1");
    grammatical_tag
        .split(new RegExp(`(${tagRegex})`, "g"))
        .filter(Boolean)
        .forEach((tag) => {
        if (tag === "-")
            return;
        if ((0, tree_1.isNumber)(tag)) {
            // inflectional_form_categories.push(tag)
        }
        else if ((0, exports.get_label_for_BIN_inflection_form)(tag)) {
            inflectional_form_categories.push((0, exports.get_label_for_BIN_inflection_form)(tag));
        }
        else {
            if (process.env.NODE_ENV === "development") {
                console.error(`Unknown tag in BIN_classification.js: ${tag}. Full tag is ${grammatical_tag}`);
            }
        }
    });
    inflectional_form_categories = inflectional_form_categories
        .join(", ")
        .split(", ");
    /* Add "without definite article" to nouns */
    if (word_categories_output.includes("noun") &&
        !inflectional_form_categories.includes("with definite article")) {
        inflectional_form_categories.push("without definite article");
    }
    // /* Add "personal use" to verbs */
    // if (word_categories_output.includes('verb') &&
    //   !inflectional_form_categories.find(i => i.startsWith('impersonal') &&
    //     !inflectional_form_categories.includes('question form')
    //   )) {
    //   inflectional_form_categories = ['personal', ...inflectional_form_categories]
    // }
    /* If it ends in a number it is an alternative version */
    const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString();
    inflectional_form_categories.push(parseInt(variantNumber));
    return Object.assign({ word_categories: word_categories_output, inflectional_form_categories,
        original_grammatical_tag,
        BIN_domain }, rest);
};
exports.default = classify;
/*
  Overrides the tags in "classification.js" during the BIN initialization step
*/
const BIN_overrides = {
    word_overrides: {
        kk: "noun, masculine",
        kvk: "noun, feminine",
        hk: "noun, neuter",
    },
    inflection_form_overrides: {
        fsb: "positive degree, strong declension",
        fvb: "positive degree, weak declension",
        evb: "superlative degree, weak declension",
        esb: "superlative degree, strong declension",
        gr: "with definite article",
        st: "clipped imperative",
    },
};
const get_label_for_BIN_word = (tag) => {
    return BIN_overrides.word_overrides[tag] || (0, classification_1.normalizeTag)(tag) || "";
};
exports.get_label_for_BIN_word = get_label_for_BIN_word;
const get_label_for_BIN_inflection_form = (tag) => {
    return (BIN_overrides.inflection_form_overrides[tag] || (0, classification_1.normalizeTag)(tag) || "");
};
exports.get_label_for_BIN_inflection_form = get_label_for_BIN_inflection_form;
const tagRegex = (() => {
    let tags = [
        ...Object.keys(classification_1.shortcuts_used_in_BIN),
        ...Object.keys(BIN_overrides.word_overrides),
        ...Object.keys(BIN_overrides.inflection_form_overrides),
    ];
    return tags
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
        .join("|");
})();
/*
  We are only interested in knowing whether a word is a name or not
  See https://bin.arnastofnun.is/ordafordi/hlutiBIN/
*/
exports.relevant_BIN_domains = {
    ism: "human name",
    erm: "human name",
    föð: "patronymic",
    móð: "matronymic",
    gæl: "human nickname",
    ætt: "surname",
    hetja: "name",
    bær: "place name",
    göt: "place name",
    lönd: "place name",
    þor: "place name",
    örn: "place name",
    erl: "place name",
};
// export const BIN_domains = Object.keys(relevant_BIN_domains).map(key => relevant_BIN_domains[key])
