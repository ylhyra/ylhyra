import Word from "inflection/tables/word";
import {
  Html,
  InflectionalCategoryList,
  TreeItem,
  TreeItems,
} from "inflection/tables/types";
import {
  RenderCellOptions,
  StructureOptions,
} from "inflection/tables/tables/types";
import { renderTable } from "inflection/tables/tables/render/renderTable";

/**
 * Wrapper for "RenderTable", creates two alternative versions of the input,
 * one original and one by splitting each column into its own table
 * to make them fit on small screens
 */
export const renderTableWrapperForSmallScreens: typeof renderTable = (
  input,
  original_word,
  structure,
  highlight,
  options
): Html => {
  let { column_names, row_names } = structure;
  column_names = column_names || [null];
  row_names = row_names || [null];
  let output = "";
  let differentOnSmallerScreens = column_names.length > 1;
  output +=
    `<div class="${differentOnSmallerScreens ? "for_large_screens" : ""}">` +
    renderTable(
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
          return renderTable(
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
};
