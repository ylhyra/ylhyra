import { last } from 'lodash'

/**
 * Here we remove variants which are not of any relevance to a second language student.
 * We remove:
 *   - Extremely obscure forms
 *   - Incorrect variants
 */
export const discardUnnecessaryForms = (rows) => {
  return discardObscureForms(removeIncorrectVariants(rows))
}

/**
 * Discard extremely obscure forms which are not relevant for a student
 * Removed are:
 *   - Infinitive past tense („Hún sagðist hefðu“). See https://bin.arnastofnun.is/korn/23
 */
export const discardObscureForms = (rows) => {
  return rows.filter(row => (
    !['infinitive', 'past tense'].every(i => row.inflectional_form_categories.includes(i))
  ))
}

/**
 * Remove variants which are marked as being "incorrect" in standard Icelandic
 */
export const removeIncorrectVariants = (rows) => {
  return rows.filter(row => {
    // console.log(row)
    // /* Note: Commented out as "hendi" is marked with this */
    // if (row.should_be_taught) {
    //   return true
    // }
    /* Leave the first item */
    if (last(row.inflectional_form_categories) === 1 || last(row.inflectional_form_categories) === '1') {
      return true
    }
    /* Leave subsequent items if they are correct */
    if (row.correctness_grade_of_inflectional_form === 1 || row.correctness_grade_of_inflectional_form === '1') {
      return true
    }
    return false
  })
}
