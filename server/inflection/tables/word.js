import getTables from 'tables/tables_all'
import getSingleTable from 'tables/tables_single'
import tree, { isNumber } from 'tables/tree'
import { getHelperWordsBefore, getHelperWordsAfter } from 'tables/functions/helperWords'
import { getPrincipalParts } from 'tables/functions/principalParts'
import { getWordDescription } from 'tables/functions/wordDescription'
import { getWordNotes } from 'tables/functions/wordNotes'
import { getStem } from 'tables/functions/stem'
import { isStrong, isWeak } from 'tables/functions/strong'
import { discardUnnecessaryForms } from 'tables/functions/discard'
import { types, normalizeTag, getTagInfo } from 'tables/classification/classification'
import { flatten } from 'lodash'
import { FindIrregularities } from 'tables/functions/irregularities'
import { relevant_BIN_domains } from 'tables/classification/BIN_classification'

class Word {
  /**
   * @param {array} rows
   * @param {?Word} original
   */
  constructor(rows, original) {
    if (!Array.isArray(rows) && rows !== undefined) {
      // console.log(rows)
      throw new Error(`Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`)
    }
    rows = rows || []

    /* Test for broken input */
    if (!original) {
      if (!rows.every(row => {
          return typeof row === 'object' && 'inflectional_form_categories' in row
        })) throw new Error('Malformed input to Word');
    }

    rows = discardUnnecessaryForms(rows)
    this.rows = rows
    if (original instanceof Word) {
      this.original = original.original
    } else if (original) {
      // console.log(original)
      throw new Error('Expected original to be a Word');
    } else {
      this.original = this
    }


    if (rows && !original) {
      if (this.rows.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('Word created with empty rows')
        }
      }
      this.setup()
      // console.log(this.rows.map(r => r.formattedOutput))
    }
  }
  setup() {
    // console.log(this.rows[0])
    if ('alreadySetup' in this) {
      throw new Error('Has already been set up')
    }
    this.FindIrregularities()
    this.alreadySetup = true
  }

  /* temp */
  highlight(input_string) {
    if (!input_string) return this;
  }

  getId() {
    return this.original.rows.length > 0 && this.original.rows[0].BIN_id
  }
  getBaseWord() {
    return this.original.rows.length > 0 && this.original.rows[0].base_word || ''
  }
  getIsWordIrregular() {
    return this.original.wordIsIrregular
  }
  getWordHasUmlaut() {
    return this.original.wordHasUmlaut
  }
  /**
   * @param  {array|...string} values
   */
  is(...values) {
    values = flatten(values)
    return values.every(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(normalizeTag(value))) {
        return true
      }
      /* Test inflectional_form_categories */
      return this.rows.length > 0 && this.rows.every(row => (
        row.inflectional_form_categories.includes(normalizeTag(value))
      ))
    })
  }
  /**
   * @param  {array|...string} values
   */
  isAny(...values) {
    values = flatten(values)
    return values.some(value => {
      /* Test word_categories */
      if (this.getWordCategories().includes(normalizeTag(value))) {
        return true
      }
      /* Test inflectional_form_categories */
      return this.rows.length > 0 && this.rows.every(row => (
        row.inflectional_form_categories.includes(normalizeTag(value))
      ))
    })
  }
  /**
   * @param  {array|...string} values
   */
  get(...values) {
    if (!values) return this;
    values = flatten(values)
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value =>
        row.inflectional_form_categories.includes(normalizeTag(value))
        // || row.word_categories.includes(value) // Should not be needed
      )
    )), this)
  }
  /**
   * Used in string table generation
   */
  getMostRelevantSibling(...values) {
    if (!values) return this;
    values = flatten(values)
    let values_types = values.map(v => getTagInfo(v) && getTagInfo(v).type)
    let try_to_match_as_many_as_possible = []
    this.getFirstClassification().forEach(c => {
      let relevant_type_index = values_types.findIndex(v => v === getTagInfo(c).type)
      if (relevant_type_index >= 0) {
        try_to_match_as_many_as_possible.push(values[relevant_type_index])
      } else {
        try_to_match_as_many_as_possible.push(c)
      }
    })

    let possible_rows = this.getOriginal().rows.map(row => {
      if (!values.every(j => row.inflectional_form_categories.includes(j))) {
        // console.log({values,in:row.inflectional_form_categories})
        return null;
      }

      let match_score = 0
      row.inflectional_form_categories.forEach(cat => {
        if (try_to_match_as_many_as_possible.includes(cat)) {
          match_score++
        }
      })
      return { inflectional_form_categories: row.inflectional_form_categories, match_score }
    }).filter(Boolean)

    if (possible_rows.length > 0) {
      let best_match = possible_rows.sort((a, b) => b.match_score - a.match_score)[0].inflectional_form_categories.filter(i => !isNumber(i))
      // console.log({best_match,values})
      return this.getOriginal().get(best_match)
    } else {
      // console.log({values,try_to_match_as_many_as_possible})
      return this.returnEmptyWord()
    }
  }
  returnEmptyWord() {
    return new Word([], this)
  }
  /**
   * Returns all that meet *any* of the input values
   * @param  {array|...string} values
   */
  getMeetingAny(...values) {
    if (!values) return this;
    values = flatten(values)
    if (values.filter(Boolean).length === 0) return this;
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).some(value =>
        row.inflectional_form_categories.includes(normalizeTag(value))
      )
    )), this)
  }
  getOriginal() {
    if (this.original.rows.length === 0) throw new Error('Empty original')
    return this.original
  }
  getFirst() {
    return new Word(this.rows.slice(0, 1), this)
  }
  getFirstAndItsVariants() {
    /* We make sure the categories are completely equal to prevent
     * verbs (which come in various deep nestings) from matching */
    let match = this.getFirstClassification()
    return new Word(this.rows.filter(row =>
      match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
      match.every((value, index) => value === row.inflectional_form_categories[index])
    ), this)
  }
  getFirstValue() {
    return this.rows.length > 0 && this.rows[0].inflectional_form || undefined
  }
  getFirstValueRendered() {
    return this.rows.length > 0 && this.rows[0].formattedOutput || undefined
  }
  getForms() {
    return this.rows.map(row => row.inflectional_form)
  }
  getForms_describe_as_string__temp() {
    return this.rows.map(row => `${row.inflectional_form} ${row.inflectional_form_categories.join(',')}`).join('\n')
  }
  getWordCategories() {
    return this.original.rows[0] && this.original.rows[0].word_categories || []
  }
  getFirstClassification() {
    return this.rows.length > 0 && this.rows[0].inflectional_form_categories.filter(i => !isNumber(i)) || []
  }
  /**
   * @param  {array|...string} values
   */
  without(...values) {
    values = flatten(values)
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => !row.inflectional_form_categories.includes(normalizeTag(value)))
    )), this)
  }
  /**
   * Used to ask "which case does this word have?"
   * E.g. getType('case') returns 'nominative'
   *
   * @param  {string} type
   * @return {?string}
   */
  getType(type) {
    const classification = [
      ...this.getWordCategories(),
      // TODO: Should we get first class or that which applies to all?
      ...this.getFirstClassification(),
    ]
    let relevantTypes = types[type]
    if (!relevantTypes) return;
    return classification.find(i => relevantTypes.includes(i))
  }
  getDomain() {
    return this.rows.length > 0 && relevant_BIN_domains[this.rows[0].BIN_domain]
    // console.log(this.getFirst())
  }

  /**
   * Three values are inputted, a value is returned
   * based on the gender of the word.
   * Used when generating helper words
   * @param  {...*} values
   */
  dependingOnGender(...values) {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  /**
   * Five values are inputted, a value is returned
   * based on the subject type of the verb
   * Used when generating helper words
   * @param  {...*} values
   */
  dependingOnSubject(...values) {
    if (this.is('impersonal with accusative subject')) {
      return values[1]
    } else if (this.is('impersonal with dative subject')) {
      return values[2]
    } else if (this.is('impersonal with genitive subject')) {
      return values[3]
    } else if (this.is('impersonal with dummy subject')) {
      return values[4]
    } else {
      return values[0]
    }
  }
  getRows() {
    return this.rows
  }
  getTree() {
    return tree(this.rows)
  }
  /* Returns array */
  renderForms() {
    let word = this
    return this.rows.map(row => {
      /* formattedOutput contains umlaut higlights */
      let out = row.formattedOutput || row.inflectional_form
      if (row.matched_term === row.inflectional_form) {
        out = `<span class="highlight">${out}</span>`
      }
      return out
    })
  }
  /* Returns string with helper words */
  render(options) {
    let output =
      this.getHelperWordsBefore() + ' ' +
      this.renderForms().map(i => `<b>${i}</b>`).join(' / ') +
      this.getHelperWordsAfter()
    output = output.trim()

    // const highlight = options && options.highlight
    // if (highlight && this.is(highlight)) {
    //   output = `<span class="highlight">${output}</span>`
    // }

    return output
  }
  /**
    A snippet is a short example of a conjugation to display in search results
  */
  getSnippet() {
    // if (this.is('verb')) {
    //   return this.getPrincipalParts()
    // }

    /* Which variant to highlight? */
    let chosen_variant_to_show = []
    let variants_matched = []
    this.rows.forEach(row => {
      if (row.variant_matched) {
        variants_matched.push(row)
      }
    })
    variants_matched = variants_matched.sort((a, b) => {
      return (b.should_be_taught + b.correctness_grade_of_inflectional_form + b.correctness_grade_of_word) -
        (a.should_be_taught + a.correctness_grade_of_inflectional_form + a.correctness_grade_of_word)
    })
    if (variants_matched.length > 0) {
      chosen_variant_to_show = variants_matched[0].inflectional_form_categories.filter(i => !isNumber(i))
    }

    return this.getSingleTable({
      returnAsString: true,
      give_me: chosen_variant_to_show,
    })
  }
}

export const WordFromTree = (input, original) => {
  let rows = []
  const traverse = (x) => {
    if (Array.isArray(x)) {
      x.map(traverse)
    } else if (x.values) {
      x.values.map(traverse)
    } else {
      rows.push(x)
    }
  }
  traverse(input)
  return new Word(rows, original)
}

Word.prototype.getHelperWordsBefore = getHelperWordsBefore
Word.prototype.getHelperWordsAfter = getHelperWordsAfter
Word.prototype.getPrincipalParts = getPrincipalParts
Word.prototype.getStem = getStem
Word.prototype.isStrong = isStrong
Word.prototype.isWeak = isWeak
Word.prototype.getTables = getTables
Word.prototype.getSingleTable = getSingleTable
Word.prototype.getWordDescription = getWordDescription
Word.prototype.getWordNotes = getWordNotes
Word.prototype.FindIrregularities = FindIrregularities

export default Word
