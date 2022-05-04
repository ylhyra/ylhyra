import link from "inflection/tables/link";
import { CellStructure, TableStructure } from "inflection/tables/tables/types";
import { GrammaticalTag } from "inflection/tables/types";
import flattenArray from "modules/flattenArray";
import { c } from "modules/noUndefinedInTemplateLiteral";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";

/**
 * Renders <th/> labels, i.e. the row and column names
 */
export const renderLabelCell = (
  tableStructure: TableStructure,
  cell: CellStructure,
  row_index: number,
  column_index: number
) => {
  let isCellToTheLeftEmpty =
    tableStructure[row_index][column_index - 1] === null;
  let isCellAboveEmpty =
    tableStructure[row_index - 1] &&
    tableStructure[row_index - 1][column_index] === null;
  let cssClass = isCellAboveEmpty || isCellToTheLeftEmpty ? "first-top" : "";

  /** Flatten to support multiple distinct items shown in one <th/> label */
  let flatListOfGrammaticalTags = flattenArray([
    cell,
  ]) as (GrammaticalTag | null)[];
  if (flatListOfGrammaticalTags[0]) {
    flatListOfGrammaticalTags[0] = uppercaseFirstLetter(
      flatListOfGrammaticalTags[0]
    );
  }
  const label = flatListOfGrammaticalTags.map((u) => link(u)).join(", ");

  return c`<th colSpan="2" class="${cssClass}">${label}</th>`;
};
