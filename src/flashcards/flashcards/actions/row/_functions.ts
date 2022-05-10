import { getDeckByIdRequired } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { getPlaintextFromUnformattedVocabularyEntry } from "flashcards/flashcards/actions/format/format";
import { Row } from "flashcards/flashcards/actions/row/row";
import { RowId } from "flashcards/flashcards/actions/row/rowData.types";
import { DeckId } from "flashcards/flashcards/types";
import { values } from "modules/typescript/objectEntries";
import shortid from "shortid";
import _ from "underscore";

export const addRow = (deckId: DeckId) => {
  const rowId = shortid.generate() as RowId;
  /* Todo */
  const rowNumber = 0;
  getDeckByIdRequired(deckId).rows[rowId] = new Row(
    getDeckByIdRequired(deckId),
    {
      rowId,
      rowNumber: getHighestRowNumber(deckId) + 1,
    }
  );
  return rowId;
};
const getHighestRowNumber = (deckId: DeckId): number => {
  return (
    _.max(
      values(getDeckByIdRequired(deckId).rows).map((row) => row.data.rowNumber)
    ) || 0
  );
};
/**
 *
 */
export const getPossibleAlternativeIds = (input: string): string[] => {
  if (!input) return [];
  // if (Array.isArray(input)) {
  //   return getPossibleAlternativeIds(
  //     input.map(getPlaintextFromUnformattedVocabularyEntry).join(";")
  //   );
  // }
  const original = getPlaintextFromUnformattedVocabularyEntry(input);
  const lowercase = original.toLowerCase();
  const withoutPeriodsOrQuestionMarks = lowercase.replace(/[.?!]+$/, "");

  return [original, lowercase, withoutPeriodsOrQuestionMarks];
};
