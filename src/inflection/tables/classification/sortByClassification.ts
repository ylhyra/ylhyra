import { sortedTags } from "inflection/tables/classification/classification";
import { TreeItem, Row } from "inflection/tables/types";

export const sortByClassification = (
  a: TreeItem | Row,
  b: TreeItem | Row
): number => {
  /* Sort by single tag */
  if ("tag" in a && "tag" in b) {
    return sortedTags.indexOf(a.tag) - sortedTags.indexOf(b.tag);
  }

  if (!a.inflectional_form_categories || !b.inflectional_form_categories) {
    throw new Error(
      `sortByClassification received an object which does not contain "inflectional_form_categories"`
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

  if ("variant_number" in a && "variant_number" in b) {
    return (a.variant_number || 0) - (b.variant_number || 0);
  }

  return 0;
};
