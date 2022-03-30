"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeak = exports.isStrong = void 0;
const vowels_1 = require("inflection/tables/functions/vowels");
/**
 * Strong or weak inflection
 * TODO: Pronouns
 *
 * @module Word
 * @return {?boolean}
 */
function isStrong() {
    let results;
    if ("isStrong_saved" in this) {
        return this.isStrong_saved;
    }
    /* Noun */
    if (this.is("noun")) {
        const table_to_check = this.getOriginal()
            .get("singular", "without definite article", 1)
            .getForms();
        if (table_to_check.length === 0)
            return;
        results = table_to_check.some(vowels_1.endsInConsonant);
    }
    else if (this.is("verb")) {
        /* Verb */
        // const word = this.getOriginal().without(
        //   'impersonal with accusative subject',
        //   'impersonal with dative subject',
        //   'impersonal with genitive subject',
        //   'impersonal with dummy subject'
        // ).get('active voice')
        const past_tense = this.get(
        /*'indicative', */ "past tense" /*'1st person', 'singular'*/).getFirstValue();
        /* Does not end in "-i" */
        results = !/i$/.test(past_tense);
    }
    this.isStrong_saved = results;
    return results;
}
exports.isStrong = isStrong;
/**
 * Opposite of the above
 *
 * @module Word
 * @return {?boolean}
 */
function isWeak() {
    const strong = this.isStrong();
    if (strong !== undefined) {
        return !strong;
    }
}
exports.isWeak = isWeak;
