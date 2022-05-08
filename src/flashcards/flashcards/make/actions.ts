import { RowId } from "flashcards/flashcards/types/row";
import { customHistory } from "modules/router";
import { getDeckByIdRequired } from "flashcards/flashcards/stores/base/functions";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { getPlaintextFromUnformattedVocabularyEntry } from "flashcards/flashcards/compile/format/format";
import { values } from "modules/typescript/objectEntries";
import _ from "underscore";
import shortid from "shortid";

export const newDeck = () => {
  const id = shortid.generate();
  getFlashcardsStore().decks[id] = {
    deckId: id,
    settings: {},
    rows: {},
  };
  customHistory.replace(`/flashcards/deck/${id}`);
};

export const addRow = (deckId: string) => {
  const rowId = shortid.generate() as RowId;
  /* Todo */
  const rowNumber = 0;
  getDeckByIdRequired(deckId).rows[rowId] = {
    rowId,
    rowNumber: getHighestRowNumber(deckId) + 1,
  };
  return rowId;
};

const getHighestRowNumber = (deckId: string): number => {
  return (
    _.max(
      values(getDeckByIdRequired(deckId).rows).map((row) => row.rowNumber)
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
