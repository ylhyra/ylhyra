import { isNumber } from "inflection/tables/tree";
import { Html, InflectionalCategoryList, Rows } from "inflection/tables/types";
import Word from "inflection/tables/word";

/**
 * A snippet is a short example of a conjugation to display in search results
 */
export function getSnippet(this: Word): Html {
  // if (this.is('verb')) {
  //   return this.getPrincipalParts()
  // }

  /* Which variant to highlight? */
  let chosenVariantToShow: InflectionalCategoryList = [];
  let variantsMatched: Rows = [];
  this.rows.forEach((row) => {
    if (row.variant_matched) {
      variantsMatched.push(row);
    }
  });
  variantsMatched = variantsMatched.sort((a, b) => {
    return (
      (b.should_be_taught ? 1 : 0) +
      b.correctness_grade_of_inflectional_form +
      b.correctness_grade_of_word -
      ((a.should_be_taught ? 1 : 0) +
        a.correctness_grade_of_inflectional_form +
        a.correctness_grade_of_word)
    );
  });
  if (variantsMatched.length > 0) {
    chosenVariantToShow =
      variantsMatched[0].inflectional_form_categories.filter(
        (i) => !isNumber(i)
      );
  }

  return this.getSingleTable({
    returnAsString: true,
    give_me: chosenVariantToShow,
  });
}
