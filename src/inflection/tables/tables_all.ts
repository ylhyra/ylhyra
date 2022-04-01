import { ucfirst } from "ylhyra/app/app/functions/ucfirst";
import { types } from "inflection/tables/classification/classification";
import link from "inflection/tables/link";
import RenderTable, { renderCell } from "inflection/tables/render_table";
import { isNumber } from "inflection/tables/tree";
import Word, { WordFromTree } from "inflection/tables/word";

/**
 * getTables - Prints all tables for a given word
 *
 * @module Word
 * @return {string} HTML as string
 */
export default function getTables(): string {
  return TraverseTree(this.getTree(), this);
}

/**
 * TraverseTree - Recursively goes through the tree from ./tree.js and prints all tables
 *
 * @param {object} leaf - Leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 * @param {Word} original_word
 * @return {string} HTML as string
 */
const TraverseTree = (leaf: object, original_word: Word): string => {
  let table = null;
  const word = WordFromTree(leaf, original_word);
  /* Nouns */
  if (word.is("noun") && types["plurality"].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types["article"],
      row_names: types["cases"],
    });
  } else if (
    /* Pronouns */
    (word.is("pronoun") || word.is("article")) &&
    types["plurality"].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types["gender"],
      row_names: types["cases"],
    });
  } else if (word.is("personal pronoun")) {
    /* Personal pronouns */
    table = RenderTable(leaf.values, original_word, {
      column_names: types["plurality"],
      row_names: types["cases"],
    });
  } else if (word.is("reflexive pronoun")) {
    /* Reflexive pronouns */
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: types["cases"],
    });
  } else if (
    /* Adjectives */
    (word.is("adjective") ||
      word.is("past participle") ||
      word.is("ordinal number") ||
      word.is("numeral")) &&
    types["plurality"].includes(leaf.tag)
  ) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types["gender"],
      row_names: types["cases"],
    });
  } else if (
    /* Verbs */
    word.is("verb") &&
    types["tense"].includes(leaf.tag) &&
    !word.is("question form") &&
    !word.is("infinitive")
  ) {
    /* Dummy subjects */
    if (word.is("impersonal with dummy subject")) {
      table = RenderTable(leaf.values, original_word, {
        column_names: ["singular"],
        row_names: ["3rd person"],
      });
    } else {
      /* Regular table */
      table = RenderTable(leaf.values, original_word, {
        column_names: types["plurality"],
        row_names: types["person"],
      });
    }
  } else if (leaf.tag === "imperative") {
    /* Imperative */
    table = RenderTable(leaf.values, original_word, {
      column_names: [null],
      row_names: ["singular", "plural", "clipped imperative"],
    });
  } else if (word.is("question form") && types["tense"].includes(leaf.tag)) {
    table = RenderTable(leaf.values, original_word, {
      column_names: types["plurality"],
      row_names: ["2nd person"],
    });
  }

  let output = table;
  if (!output) {
    /*
      Go deeper
    */
    if (leaf.values && !LeafOnlyContainsVariants(leaf.values)) {
      output = leaf.values.map((i) => TraverseTree(i, original_word)).join("");
    } else {
      /*
      No table was created above,
      generate a simple field
    */
      let rows = leaf.values || [leaf]; /* For supine of "geta" */
      output = `<table class="table not-center"><tbody><tr>${renderCell(
        new Word(rows, original_word)
      )}</tr></tbody></table>`;
    }
  }

  if (leaf.tag) {
    return `<dl class="indent">
      <dt>${link(ucfirst(leaf.tag))}</dt>
      <dd>${output}</dd>
    </dl>`;
  } else {
    return output;
  }
};

/**
 * If a leaf only contains a single form and its variants,
 * we want to be able to group them together.
 * Created to handle the supine of "geta".
 */
const LeafOnlyContainsVariants = (array) => {
  let first = array[0];
  if (!first || !first.inflectional_form_categories) return;
  let match = first.inflectional_form_categories.filter((i) => !isNumber(i));
  return array.slice(1).every(
    (row) =>
      row.inflectional_form_categories &&
      match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
      match.every(
        (value, index) => value === row.inflectional_form_categories[index]
      )
  );
};
