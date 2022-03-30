"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeIncorrectVariants = exports.discardObscureForms = exports.discardUnnecessaryForms = void 0;
const lodash_1 = require("lodash");
/**
 * Here we remove variants which are not of any relevance to a second language student.
 * We remove:
 *   - Extremely obscure forms
 *   - Incorrect variants
 */
const discardUnnecessaryForms = (rows) => {
    return (0, exports.discardObscureForms)((0, exports.removeIncorrectVariants)(rows));
};
exports.discardUnnecessaryForms = discardUnnecessaryForms;
/**
 * Discard extremely obscure forms which are not relevant for a student
 * Removed are:
 *   - Infinitive past tense („Hún sagðist hefðu“). See https://bin.arnastofnun.is/korn/23
 */
const discardObscureForms = (rows) => {
    return rows.filter((row) => !["infinitive", "past tense"].every((i) => row.inflectional_form_categories.includes(i)));
};
exports.discardObscureForms = discardObscureForms;
/**
 * Remove variants which are marked as being "incorrect" in standard Icelandic
 */
const removeIncorrectVariants = (rows) => {
    return rows.filter((row) => {
        // console.log(row)
        // /* Note: Commented out as "hendi" is marked with this */
        // if (row.should_be_taught) {
        //   return true
        // }
        /* Leave the first item */
        if ((0, lodash_1.last)(row.inflectional_form_categories) === 1 ||
            (0, lodash_1.last)(row.inflectional_form_categories) === "1") {
            return true;
        }
        /* Leave subsequent items if they are correct */
        if (row.correctness_grade_of_inflectional_form === 1 ||
            row.correctness_grade_of_inflectional_form === "1") {
            return true;
        }
        return false;
    });
};
exports.removeIncorrectVariants = removeIncorrectVariants;
