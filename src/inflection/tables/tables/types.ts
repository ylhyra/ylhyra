import { InflectionalCategoryListOrNestedList } from "inflection/tables/tables/getSingleTable";
import { GrammaticalTag } from "inflection/tables/types";
import Word from "inflection/tables/word";

/** Nested array on form Row > Column > Cell */
export type TableStructure = Array<RowStructure>;
export type RowStructure = Array<CellStructure>;
/** If a cell contains a Word, then it is a content cell. If not, it is a heading cell */
export type CellStructure = Word | LabelCellStructure;
export type LabelCellStructure =
  | GrammaticalTag
  | InflectionalCategoryListOrNestedList
  | null;

export type RenderCellOptions = {
  linkWords?: Boolean;
};

export type StructureOptions = {
  column_names: InflectionalCategoryListOrNestedList;
  row_names: InflectionalCategoryListOrNestedList;
};
