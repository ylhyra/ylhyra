import {
  CorrectnessGrade,
  TreeItems,
  PRIMARY_VARIANT_NUMBER,
  Rows,
} from "inflection/tables/types";

/**
 * Here we remove variants which are not of any relevance to a second language student.
 * We remove:
 *   - Extremely obscure forms
 *   - Incorrect variants
 */
export const discardUnnecessaryForms = (
  rows: Rows | TreeItems
): Rows | TreeItems => {
  return discardObscureForms(removeIncorrectVariants(rows));
};

/**
 * Discard extremely obscure forms which are not relevant for a student
 * Removed are:
 *   - Infinitive past tense („Hún sagðist hefðu“). See https://bin.arnastofnun.is/korn/23
 */
export const discardObscureForms = (
  rows: Rows | TreeItems
): Rows | TreeItems => {
  return rows.filter(
    (row) =>
      !["infinitive", "past tense"].every((i) =>
        row.inflectional_form_categories.includes(i)
      )
  );
};

/**
 * Remove variants which are marked as being "incorrect" in standard Icelandic
 */
export const removeIncorrectVariants = (
  rows: Rows | TreeItems
): Rows | TreeItems => {
  return rows.filter((row) => {
    // console.log(row)
    // /* Note: Commented out as "hendi" is marked with this */
    // if (row.should_be_taught) {
    //   return true
    // }
    /* Leave the first item */
    if (row.variant_number === PRIMARY_VARIANT_NUMBER) {
      return true;
    }
    /* Leave subsequent items if they are correct */
    if (
      row.correctness_grade_of_inflectional_form === CorrectnessGrade.Default
    ) {
      return true;
    }
    return false;
  });
};
