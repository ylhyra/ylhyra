import link from "inflection/tables/link";
import {
  GrammaticalTag,
  Html,
  InflectionalCategoryList,
  Leaf,
} from "inflection/tables/types";
import Word, { wordFromTree } from "inflection/tables/word";
import { flatten } from "lodash";
import { removeHtmlWhitespace } from "ylhyra/app/app/functions/removeHtmlWhitespace";
import { ucfirst } from "ylhyra/app/app/functions/ucfirst";
import { RowOrColumn } from "inflection/tables/tables_single";

export type RenderCellOptions = {
  linkWords?: boolean;
};
export type StructureOption = {
  column_names: RowOrColumn;
  row_names: RowOrColumn;
};

/*
  Wrapper for "RenderTable", creates two alternative versions of the input,
  one original and one by splitting each column into its own table
  to make them fit on small screens
*/
export default function AlsoMakeTablesThatFitOnSmallScreens(
  input: Word,
  original_word: Word,
  structure: StructureOption,
  highlight: InflectionalCategoryList,
  options: RenderCellOptions
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
  input: Word | Leaf,
  original_word: Word,
  structure: StructureOption,
  highlight: InflectionalCategoryList,
  options?: RenderCellOptions
): Html => {
  const { column_names, row_names } = structure;
  let word: Word;
  if (input instanceof Word) {
    word = input;
  } else {
    word = wordFromTree(input, original_word);
  }
  /** Nested array on form Row > Column > Cell */
  let table: Array<Array<Word | GrammaticalTag | null>> = [];
  row_names.forEach((row_name, row_index) => {
    /* Add column names */
    if (row_index === 0 && column_names[0] !== null) {
      let column = [];
      column.push(null);
      column_names.forEach((column_name) => {
        column.push(column_name);
      });
      table.push(column);
    }

    /* Loop over data */
    let column: Array<Word | GrammaticalTag | null> = [];
    column_names.forEach((column_name, column_index) => {
      /* Add row names */
      if (column_index === 0) {
        column.push(row_name as GrammaticalTag);
      }
      column.push(word.get(column_name, row_name).getFirstAndItsVariants());
    });
    table.push(column);
  });
  return removeHtmlWhitespace(tableHTML(table, highlight, options));
};

const tableHTML = (
  rows: RowOrColumn,
  highlight: InflectionalCategoryList,
  options?: RenderCellOptions
) => {
  return `
    <table class="table">
      <tbody>
        ${rows
          .map(
            (row, row_index) => `
          <tr>
            ${row
              .map((cell, column_index) => {
                if (cell instanceof Word) {
                  const shouldHighlight =
                    highlight?.length > 0 ? cell.is(...highlight) : true;
                  return renderCell(cell, shouldHighlight, options);
                } else {
                  let isCellToTheLeftEmpty =
                    rows[row_index][column_index - 1] === null;
                  let isCellAboveEmpty =
                    rows[row_index - 1] &&
                    rows[row_index - 1][column_index] === null;
                  let css_class =
                    isCellAboveEmpty || isCellToTheLeftEmpty ? "first-top" : "";

                  /* Flatten to support multiple at once */
                  let i = flatten([cell]);
                  i[0] = ucfirst(i[0]);
                  i = i.map((u) => link(u)).join(", ");

                  return `<th colSpan="2" class="${css_class}">${i || ""}</th>`;
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
  shouldHighlight: Boolean,
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
