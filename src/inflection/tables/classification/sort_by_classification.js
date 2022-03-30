"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort_by_classification = void 0;
const classification_1 = require("inflection/tables/classification/classification");
const sort_by_classification = (a, b) => {
    /* Sort by single tag */
    if (a.tag) {
        return classification_1.sorted_tags.indexOf(a.tag) - classification_1.sorted_tags.indexOf(b.tag);
    }
    // console.log({a,b})
    if (!a.inflectional_form_categories || !b.inflectional_form_categories) {
        console.error(`sort_by_classification received an object which does not contain "inflectional_form_categories"`);
        return false;
    }
    /* Sort by full array of classification */
    for (let i = 0; i < a.inflectional_form_categories.length; i++) {
        if (!b.inflectional_form_categories[i])
            break;
        if (a.inflectional_form_categories[i] === b.inflectional_form_categories[i])
            continue;
        return (classification_1.sorted_tags.indexOf(a.inflectional_form_categories[i]) -
            classification_1.sorted_tags.indexOf(b.inflectional_form_categories[i]));
    }
    /* Sort by variant number */
    return a.variant_number - b.variant_number;
};
exports.sort_by_classification = sort_by_classification;
