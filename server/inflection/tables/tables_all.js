import link, { ucfirst } from 'tables/link'
import Word, { WordFromTree } from 'tables/word'
import RenderTable, { renderCell } from 'tables/render_table'
import { types } from 'tables/classification/classification'
import tree, { isNumber } from 'tables/tree'

/**
 * getTables - Prints all tables for a given word
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function getTables() {
  return TraverseTree(this.getTree(), this)
}

/**
 * TraverseTree - Recursively goes through the tree from ./tree.js and prints all tables
 *
 * @param {object} leaf - Leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 * @param {Word} original_word
 * @return {string} HTML as string
 */
const TraverseTree = (leaf, original_word) => {
  let table = null
  const word = WordFromTree(leaf, original_word)
  /* Nouns */
  if (word.is('noun') && types['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['article'],
      row_names: types['cases'],
    })
  }
  /* Pronouns */
  else if ((word.is('pronoun') || word.is('article')) && types['plurality'].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['gender'],
      row_names: types['cases']
    })
  }
  /* Personal pronouns */
  else if (word.is('personal pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['plurality'],
      row_names: types['cases']
    })
  }
  /* Reflexive pronouns */
  else if (word.is('reflexive pronoun')) {
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: types['cases']
    })
  }
  /* Adjectives */
  else if (
    (word.is('adjective') ||
      word.is('past participle') ||
      word.is('ordinal number') ||
      word.is('numeral')
    ) && types['plurality'].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['gender'],
      row_names: types['cases']
    })
  }
  /* Verbs */
  else if (
    word.is('verb') && types['tense'].includes(leaf.tag) &&
    !word.is('question form') &&
    !word.is('infinitive')
  ) {
    /* Dummy subjects */
    if (word.is('impersonal with dummy subject')) {
      table = RenderTable(leaf.values, original_word, {
        column_names: ['singular'],
        row_names: ['3rd person']
      })
    }
    /* Regular table */
    else {
      table = RenderTable(leaf.values, original_word, {
        column_names: types['plurality'],
        row_names: types['person']
      })
    }
  }
  /* Imperative */
  else if (
    leaf.tag === 'imperative'
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: ['singular', 'plural', 'clipped imperative']
    })
  } else if (
    word.is('question form') &&
    types['tense'].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types['plurality'],
      row_names: ['2nd person']
    })
  }

  let output = table
  if (!output) {
    /*
      Go deeper
    */
    if (leaf.values && !LeafOnlyContainsVariants(leaf.values)) {
      output = leaf.values.map(i => TraverseTree(i, original_word)).join('')
    }
    /*
      No table was created above,
      generate a simple field
    */
    else {
      let rows = leaf.values || [leaf] /* For supine of "geta" */
      output =
        `<table class="table not-center"><tbody><tr>${renderCell(new Word(rows, original_word))}</tr></tbody></table>`
    }
  }

  if (leaf.tag) {
    return `<dl class="indent">
      <dt>${link(ucfirst(leaf.tag))}</dt>
      <dd>${output}</dd>
    </dl>`
  } else {
    return output
  }
}


/**
 * If a leaf only contains a single form and its variants,
 * we want to be able to group them together.
 * Created to handle the supine of "geta".
 */
const LeafOnlyContainsVariants = (array) => {
  let first = array[0]
  if (!first || !first.inflectional_form_categories) return;
  let match = first.inflectional_form_categories.filter(i => !isNumber(i))
  return array.slice(1).every(row => (
    row.inflectional_form_categories &&
    match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
    match.every((value, index) => value === row.inflectional_form_categories[index])
  ))
}
