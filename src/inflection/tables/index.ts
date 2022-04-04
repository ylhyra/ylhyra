import { TableOptionsFromUser } from "inflection/server/types";
import {
  getCanonicalGrammaticalTag,
  getOrderedGrammaticalCategories,
  grammaticalCategories,
} from "inflection/tables/classification/classification";
import { sortByClassification } from "inflection/tables/classification/sortByClassification";
import link from "inflection/tables/link";
import { RowOrColumnNameList } from "inflection/tables/tables_single";
import {
  GrammaticalCategory,
  Html,
  InflectionalCategoryList,
  Rows,
} from "inflection/tables/types";
import Word from "inflection/tables/word";

export default (rows: Rows, options: TableOptionsFromUser): Html => {
  let options_column_names =
    options && (options["columns"] || options.column_names);
  let options_row_names = options && (options.rows || options.row_names);
  let word = new Word(rows.sort(sortByClassification));

  let table;

  /** Single table  */
  if (
    options.give_me ||
    options_column_names ||
    options_row_names ||
    options.single
  ) {
    const give_me = getCanonicalGrammaticalTagFromUserInput(options.give_me);
    const column_names =
      getRowOrColumnSettingsFromUserInput(options_column_names);
    const row_names = getRowOrColumnSettingsFromUserInput(options_row_names);
    if (give_me) {
      word = word.get(...give_me);
    }
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

const getRowOrColumnSettingsFromUserInput = (
  string: string
): RowOrColumnNameList | undefined => {
  if (!string) return;
  /* If someone enters "cases" the rest is filled out */
  if (string in grammaticalCategories) {
    return getOrderedGrammaticalCategories(string as GrammaticalCategory);
  }
  return string
    .split(";")
    .map(getCanonicalGrammaticalTagFromUserInput) as RowOrColumnNameList;
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
