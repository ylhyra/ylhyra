import { sortedTags } from "inflection/tables/classification/classification";
import { Tree } from "inflection/tables/types";

export const sortByClassification = (a: Tree, b: Tree): number => {
  /* Sort by single tag */
  if (a.tag) {
    return sortedTags.indexOf(a.tag) - sortedTags.indexOf(b.tag);
  }

  if (!a.inflectional_form_categories || !b.inflectional_form_categories) {
    throw new Error(
      `sort_by_classification received an object which does not contain "inflectional_form_categories"`
    );
  }

  /* Sort by full array of classification */
  for (let i = 0; i < a.inflectional_form_categories.length; i++) {
    if (!b.inflectional_form_categories[i]) break;
    if (a.inflectional_form_categories[i] === b.inflectional_form_categories[i])
      continue;
    return (
      sortedTags.indexOf(a.inflectional_form_categories[i]) -
      sortedTags.indexOf(b.inflectional_form_categories[i])
    );
  }

  /* Sort by variant number */
  return a.variant_number - b.variant_number;
};
