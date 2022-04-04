import { wordFromTree } from "inflection/tables/helperFunctions/wordFromTree";
import link from "inflection/tables/link";
import { RowOrColumnNameList } from "inflection/tables/tables/tables_single";
import {
  GrammaticalTag,
  Html,
  InflectionalCategoryList,
  TreeItem,
  TreeItems,
} from "inflection/tables/types";
import Word from "inflection/tables/word";
import { c } from "modules/noUndefinedInTemplateLiteral";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import flattenArray from "ylhyra/app/app/functions/flattenArray";
import { removeHtmlWhitespace } from "ylhyra/app/app/functions/removeHtmlWhitespace";

/** Nested array on form Row > Column > Cell */
type TableStructure = Array<RowStructure>;
type RowStructure = Array<CellStructure>;
/** If a cell contains a Word, then it is a content cell. If not, it is a heading cell */
type CellStructure = Word | CellHeadingStructure;
type CellHeadingStructure = GrammaticalTag | RowOrColumnNameList | null;

export type RenderCellOptions = {
  linkWords?: Boolean;
};

export type StructureOption = {
  column_names: RowOrColumnNameList;
  row_names: RowOrColumnNameList;
};

/**
 * Wrapper for "RenderTable", creates two alternative versions of the input,
 * one original and one by splitting each column into its own table
 * to make them fit on small screens
 */
export default function AlsoMakeTablesThatFitOnSmallScreens(
  input: Word | TreeItem | TreeItems,
  original_word: Word,
  structure: StructureOption,
  highlight?: InflectionalCategoryList,
  options?: RenderCellOptions
): Html {
  let { column_names, row_names } = structure;
  column_names = column_names || [null];
  row_names = row_names || [null];
  let output = "";
  let differentOnSmallerScreens = column_names.length > 1;
  output +=
    `<div class="${differentOnSmallerScreens ? "for_large_screens" : ""}">` +
    RenderTable(
      input,
      original_word,
      { column_names, row_names },
      highlight,
      options
    ) +
    "</div>";

  if (differentOnSmallerScreens) {
    output +=
      `<div class="for_small_screens" hidden>` +
      column_names
        .map((column_name) => {
          return RenderTable(
            input,
            original_word,
            {
              column_names: [column_name],
              row_names,
            },
            highlight,
            options
          );
        })
        .join("") +
      "</div>";
  }
  return output;
}

/**
 * Converts description of table structure into a table
 */
const RenderTable = (
  input: Word | TreeItem | TreeItems,
  original_word: Word,
  structure: StructureOption,
  highlight?: InflectionalCategoryList,
  options?: RenderCellOptions
): Html => {
  const { column_names, row_names } = structure;
  let word: Word;
  if (input instanceof Word) {
    word = input;
  } else {
    word = wordFromTree(input, original_word);
  }
  // console.log(input);
  // word.debug();

  let table: TableStructure = [];
  row_names.forEach((row_name, row_index) => {
    /** Add column names above */
    if (row_index === 0 && column_names[0] !== null) {
      let row: RowStructure = [];
      row.push(null);
      column_names.forEach((column_name) => {
        row.push(column_name);
      });
      table.push(row);
    }

    /** Loop over data */
    let row: RowStructure = [];
    column_names.forEach((column_name, column_index) => {
      /** Add row names to the left */
      if (column_index === 0) {
        row.push(row_name as GrammaticalTag);
      }

      /** Add cells */
      row.push(word.get(column_name, row_name).getFirstAndItsVariants());
    });
    table.push(row);
  });
  return removeHtmlWhitespace(tableHtml(table, highlight, options));
};

const tableHtml = (
  tableStructure: TableStructure,
  highlight?: InflectionalCategoryList,
  options?: RenderCellOptions
): Html => {
  return `
    <table class="table">
      <tbody>
        ${tableStructure
          .map(
            (row, row_index) => `
          <tr>
            ${row
              .map((cell, column_index) => {
                if (cell instanceof Word) {
                  /** Render a cell  */
                  /** If there is no highlight option passed, then all cells are "highlighted" */
                  const shouldHighlight =
                    highlight && highlight.length > 0
                      ? cell.is(...highlight)
                      : true;
                  return renderCell(cell, shouldHighlight, options);
                } else {
                  /** Cell is not a Word, render <th/> labels instead */
                  let isCellToTheLeftEmpty =
                    tableStructure[row_index][column_index - 1] === null;
                  let isCellAboveEmpty =
                    tableStructure[row_index - 1] &&
                    tableStructure[row_index - 1][column_index] === null;
                  let cssClass =
                    isCellAboveEmpty || isCellToTheLeftEmpty ? "first-top" : "";

                  /** Flatten to support multiple distinct items shown in one <th/> label */
                  let flatListOfGrammaticalTags = flattenArray([
                    cell,
                  ]) as (GrammaticalTag | null)[];
                  if (flatListOfGrammaticalTags[0]) {
                    flatListOfGrammaticalTags[0] = uppercaseFirstLetter(
                      flatListOfGrammaticalTags[0]
                    );
                  }
                  const label = flatListOfGrammaticalTags
                    .map((u) => link(u))
                    .join(", ");

                  return c`<th colSpan="2" class="${cssClass}">${label}</th>`;
                }
              })
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

export const renderCell = (
  word: Word,
  shouldHighlight?: Boolean,
  options?: RenderCellOptions
) => {
  /* No value */
  if (word.rows.length === 0) {
    return '<td colSpan="2">–</td>';
  }
  /*
   * Make sure only variants of the same are passed on, in case multiple were accidentally passed on
   */
  if (word.rows.length > 1) {
    word = word.getFirstAndItsVariants();
  }
  const value = word.rows
    .map((row, index) => {
      return (
        `<span>` +
        (row.formattedOutput || row.inflectional_form) +
        (index + 1 < word.rows.length
          ? `<span class="light-gray"> / </span>`
          : "") +
        `</span>`
      );
    })
    .join("");
  return `
    <td class="right ${
      shouldHighlight ? "highlight" : ""
    }"><span class="gray">${word.getHelperWordsBefore()}</span></td>
    <td class="left ${shouldHighlight ? "highlight" : ""}">
      <b>${
        options?.linkWords ? `<a href="${word.getURL()}">${value}</a>` : value
      }</b><span class="gray">${word.getHelperWordsAfter()}</span>
    </td>
  `;
};
