import { getOrderedGrammaticalCategories } from "inflection/tables/classification/classification";
import { wordFromTree } from "inflection/tables/helperFunctions/wordFromTree";
import link from "inflection/tables/link";
import { isNumber } from "inflection/tables/tree";
import {
  Branch,
  Html,
  Tree,
  TreeItem,
  TreeItems,
} from "inflection/tables/types";
import Word from "inflection/tables/word";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import { renderTableWrapperForSmallScreens as renderTable } from "inflection/tables/tables/render/renderTableWrapper";
import { renderCell } from "inflection/tables/tables/render/renderCell";

/**
 * Prints all tables for a given word
 */
export default function getTables(this: Word): Html {
  return traverseTree(this.getTree(), this);
}

/**
 * Recursively goes through the tree from ./tree.js and prints all tables
 */
const traverseTree = (branch: Tree | TreeItem, original_word: Word): Html => {
  let table = null;
  const word = wordFromTree(branch, original_word);

  if ("tag" in branch) {
    /* Nouns */
    if (
      word.is("noun") &&
      getOrderedGrammaticalCategories("plurality").includes(branch.tag)
    ) {
      table = renderTable(branch.values, original_word, {
        column_names: getOrderedGrammaticalCategories("article"),
        row_names: getOrderedGrammaticalCategories("cases"),
      });
    } else if (
      /* Pronouns */
      (word.is("pronoun") || word.is("article")) &&
      getOrderedGrammaticalCategories("plurality").includes(branch.tag)
    ) {
      table = renderTable(branch.values, original_word, {
        column_names: getOrderedGrammaticalCategories("gender"),
        row_names: getOrderedGrammaticalCategories("cases"),
      });
    } else if (word.is("personal pronoun")) {
      /* Personal pronouns */
      table = renderTable(branch.values, original_word, {
        column_names: getOrderedGrammaticalCategories("plurality"),
        row_names: getOrderedGrammaticalCategories("cases"),
      });
    } else if (word.is("reflexive pronoun")) {
      /* Reflexive pronouns */
      table = renderTable(branch.values, original_word, {
        column_names: [null],
        row_names: getOrderedGrammaticalCategories("cases"),
      });
    } else if (
      /* Adjectives */
      (word.is("adjective") ||
        word.is("past participle") ||
        word.is("ordinal number") ||
        word.is("numeral")) &&
      getOrderedGrammaticalCategories("plurality").includes(branch.tag)
    ) {
      table = renderTable(branch.values, original_word, {
        column_names: getOrderedGrammaticalCategories("gender"),
        row_names: getOrderedGrammaticalCategories("cases"),
      });
    } else if (
      /* Verbs */
      word.is("verb") &&
      getOrderedGrammaticalCategories("tense").includes(branch.tag) &&
      !word.is("question form") &&
      !word.is("infinitive")
    ) {
      /* Dummy subjects */
      if (word.is("impersonal with dummy subject")) {
        table = renderTable(branch.values, original_word, {
          column_names: ["singular"],
          row_names: ["3rd person"],
        });
      } else {
        /* Regular table */
        table = renderTable(branch.values, original_word, {
          column_names: getOrderedGrammaticalCategories("plurality"),
          row_names: getOrderedGrammaticalCategories("person"),
        });
      }
    } else if (branch.tag === "imperative") {
      /* Imperative */
      table = renderTable(branch.values, original_word, {
        column_names: [null],
        row_names: ["singular", "plural", "clipped imperative"],
      });
    } else if (
      word.is("question form") &&
      getOrderedGrammaticalCategories("tense").includes(branch.tag)
    ) {
      table = renderTable(branch.values, original_word, {
        column_names: getOrderedGrammaticalCategories("plurality"),
        row_names: ["2nd person"],
      });
    }
  }

  let output = table;
  if (!output) {
    /**
     * Go deeper
     */
    if (branch.values && !leafOnlyContainsVariants(branch.values)) {
      output = branch.values
        .map((i) => traverseTree(i, original_word))
        .join("");
    } else {
      /**
       * No table was created above,
       * generate a simple field
       */
      let rows = branch.values || [branch]; /* For supine of "geta" */
      output = `<table class="table not-center"><tbody><tr>${renderCell(
        new Word(rows, original_word)
      )}</tr></tbody></table>`;
    }
  }

  if ("tag" in branch) {
    return `<dl class="indent">
      <dt>${link(uppercaseFirstLetter(branch.tag))}</dt>
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
const leafOnlyContainsVariants = (array: TreeItems) => {
  let first = array[0];
  if (!first || !first.inflectional_form_categories) return;
  let match = first.inflectional_form_categories.filter((i) => !isNumber(i));
  return array.slice(1).every(
    (row) =>
      row.inflectional_form_categories &&
      match.length ===
        /* -1 to remove variant number*/
        row.inflectional_form_categories.length - 1 &&
      match.every(
        (value, index) => value === row.inflectional_form_categories?.[index]
      )
  );
};
