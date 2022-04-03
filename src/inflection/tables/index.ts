import {
  getCanonicalGrammaticalTag,
  getOrderedGrammaticalCategories,
  grammaticalCategories,
} from "inflection/tables/classification/classification";
import { sortByClassification } from "inflection/tables/classification/sortByClassification";
import link from "inflection/tables/link";
import {
  GrammaticalCategory,
  GrammaticalTag,
  GrammaticalTagOrVariantNumber,
  Html,
  InflectionalCategoryList,
  Rows,
} from "inflection/tables/types";
import Word from "inflection/tables/word";
import {
  RowOrColumn,
  SingleTableOptions,
} from "inflection/tables/tables_single";

export default (
  rows: Rows,
  options: SingleTableOptions,
  /** Unused information from server, can be removed as this is already in rows */
  { input_string }: { input_string: string }
): Html => {
  let give_me = options?.give_me;
  // @ts-ignore
  let column_names = options && (options["columns"] || options.column_names);
  // @ts-ignore
  let row_names = options && (options.rows || options.row_names);

  let word = new Word(rows.sort(sortByClassification));

  let table;
  if (give_me || column_names || row_names || options.single) {
    give_me = getCanonicalGrammaticalTagFromUserInput(give_me);
    column_names = getRowOrColumnSettingsFromUserInput(column_names);
    row_names = getRowOrColumnSettingsFromUserInput(row_names);
    word = word.get(...give_me);
    if (word.rows.length > 0) {
      table = word.getSingleTable({
        give_me,
        column_names,
        row_names,
        skip_description: options.single,
      });
    } else {
      table = `<b>Error:</b> No rows found with the requested values`;
    }
  } else {
    table = word.getTables();
  }

  if (options.single) {
    return `
      <div class="inflection">
        ${table}
      </div>
  `;
  }

  return `
    <div class="inflection">
      <div class="main">
        ${word.renderBaseWord()}
        <div class="word_description">${word.getWordDescription()}</div>
        <div>${word.getWordNotes()}</div>
        <div class="principal_parts">${
          word.getPrincipalParts()
            ? `
            <span hidden>${link("Principal parts")}:</span>
            ${word.getPrincipalParts()}
          `
            : ""
        }</div>

        ${table}
      </div>
      <div class="license">
        <a href="https://bin.arnastofnun.is/beyging/${word.getId()}" target="_blank">View on BÍN</a> •
        <a href="https://ylhyra.is/Project:Inflections" class="info" target="_blank">About</a> •
        <a href="https://github.com/ylhyra/icelandic-inflections#readme" target="_blank">API</a>
        <hr/>
        <div>Data from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII), or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. (<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>)</div>
      </div>
    </div>
  `;
};

const getRowOrColumnSettingsFromUserInput = (string: string): RowOrColumn => {
  if (!string) return;
  /* If someone enters "cases" the rest is filled out */
  if (string in grammaticalCategories) {
    return getOrderedGrammaticalCategories(string as GrammaticalCategory);
  }
  // /* Should be made to work in the future */
  return string.split(";").map(getCanonicalGrammaticalTagFromUserInput);
};

const getCanonicalGrammaticalTagFromUserInput = (
  string: string
): InflectionalCategoryList => {
  if (!string) return [];
  return string
    .replace(/_/g, " ")
    .split(",")
    .map((i: string | number) => getCanonicalGrammaticalTag(i))
    .filter(Boolean);
};
