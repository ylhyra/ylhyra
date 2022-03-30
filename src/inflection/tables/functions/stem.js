"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStem = void 0;
const patterns_1 = require("inflection/tables/functions/patterns");
const vowels_1 = require("inflection/tables/functions/vowels");
const word_1 = __importDefault(require("inflection/tables/word"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * Gets the stem of a word. See: https://is.wikipedia.org/wiki/Stofn_(málfræði)
 *
 * @module Word
 * @param {object} options
 *   - masculinizeAdjectiveStem {boolean}
 *   - trimExtra {boolean}
 * @return {?string}
 */
function getStem(options) {
    let word = this;
    let selection;
    let output;
    if (this.is("noun")) {
        if (this.isStrong()) {
            selection = this.getOriginal().get("accusative" /*'without definite article', 'singular' */);
        }
        else {
            output = this.getOriginal()
                .get("nominative" /*'without definite article', 'singular' */)
                .getFirstValue();
            output = (0, vowels_1.removeLastVowelCluster)(output);
        }
    }
    if (this.is("adjective")) {
        output = this.getOriginal()
            .get("feminine" /* 'nominative', 'singular', 'positive degree', 'strong declension'*/)
            .getFirstValue();
        // if (!output) return;
        /*
          For the purpose of highlighting umlauts,
          we want to get the stem with the vowel that's
          used in the masculine gender
        */
        if (output && options.masculinizeAdjectiveStem) {
            const stemLength = (0, vowels_1.splitOnVowelRegions)(output).filter(Boolean).length;
            let masculine = this.getOriginal()
                .get("masculine", "nominative", "singular", 
            /*'positive degree',*/ "strong declension")
                .getFirstValue();
            if (masculine) {
                return (0, vowels_1.splitOnVowelRegions)(masculine)
                    .filter(Boolean)
                    .slice(0, stemLength)
                    .join("");
            }
            else {
                // console.log(output)
                return output;
            }
        }
        else {
            // return output
        }
    }
    // if (this.is('numeral')) {
    //   output = this.getOriginal().get('feminine', 'nominative', 'singular').getFirstValue()
    // }
    if (this.is("verb")) {
        output = this.getOriginal()
            .get("clipped imperative" /*'active voice'*/)
            .getFirstValue();
        /* Remove last vowel */
        if (this.isWeak()) {
            output = (0, vowels_1.removeLastVowelCluster)(output);
        }
        else {
            // return output
        }
    }
    if (this.isAny("numeral", "personal pronoun")) {
        output = this.getOriginal().getFirstValue();
    }
    if (selection) {
        output = selection.getFirstValue();
    }
    if (!output) {
        output = attemptToGenerateStem(word);
    }
    /* Trim even further */
    if ((options === null || options === void 0 ? void 0 : options.trimExtra) && selection) {
        output = (0, patterns_1.removeInflectionalPattern)(output, selection);
    }
    return output;
}
exports.getStem = getStem;
/*
  If no stem can be found, attempt to generate it by finding the most common region of unchanged consonants.
  Todo: May not work with singe letter words
*/
const attemptToGenerateStem = (word) => {
    let y = word
        .getOriginal()
        .rows.map((row) => (0, patterns_1.removeInflectionalPattern)(row.inflectional_form, new word_1.default([row], word)));
    let x = y.map(vowels_1.removeVowellikeClusters);
    let shortest = Math.min(...x.map((i) => i.length));
    let cut = x.map((i) => i.slice(0, shortest));
    var mostCommonConsonantBeginning = lodash_1.default.head((0, lodash_1.default)(cut).countBy().entries().maxBy(lodash_1.default.last));
    var firstVariantMatching = y.find((i) => (0, vowels_1.removeVowellikeClusters)(i).slice(0, shortest));
    /* Find match based on consonants */
    let output = "";
    let current_consonant_index = 0;
    let done = false;
    firstVariantMatching &&
        firstVariantMatching.split("").forEach((letter) => {
            if (!done) {
                if (!(0, vowels_1.isVowellikeCluster)(letter)) {
                    current_consonant_index++;
                    if (current_consonant_index >= mostCommonConsonantBeginning.length) {
                        done = true;
                    }
                }
                output += letter;
            }
        });
    /* If the above failed, try to find match using vowels as well */
    if (!output) {
        let shortest2 = Math.min(...y.map((i) => i.length));
        let cut2 = y.map((i) => i.slice(0, shortest2));
        var mostCommonBeginning2 = lodash_1.default.head((0, lodash_1.default)(cut2).countBy().entries().maxBy(lodash_1.default.last));
        return mostCommonBeginning2;
    }
    // if (word.isStrong()) {
    //
    // }
    return output;
};
