import Word from "inflection/tables/word";
import {
  GrammaticalTag,
  Html,
  InflectionalCategoryList,
  TreeItem,
  TreeItems,
} from "inflection/tables/types";
import { wordFromTree } from "inflection/tables/helperFunctions/wordFromTree";
import { removeHtmlWhitespace } from "ylhyra/app/app/functions/removeHtmlWhitespace";
import {
  RenderCellOptions,
  RowStructure,
  StructureOption,
  TableStructure,
} from "inflection/tables/tables/render_table";
import { renderCell } from "inflection/tables/tables/render/renderCell";
import flattenArray from "ylhyra/app/app/functions/flattenArray";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import link from "inflection/tables/link";
import { c } from "modules/noUndefinedInTemplateLiteral";

/**
 * Converts description of table structure into a table.
 */
export const renderTable = (
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

export const tableHtml = (
  tableStructure: TableStructure,
  highlight?: InflectionalCategoryList,
  options?: RenderCellOptions
): Html => {
  return `
    <table class="table">
      <tbody>
        ${tableStructure
          .map((row, row_index) =>
            renderRow(row, row_index, highlight, options)
          )
          .join("")}
      </tbody>
    </table>
  `;
};

const renderRow = (
  row: RowStructure,
  row_index: number,
  highlight?: InflectionalCategoryList,
  options?: RenderCellOptions
) => `
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
        `;
