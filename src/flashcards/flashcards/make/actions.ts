import { DeckId } from "flashcards/flashcards/types/types";
import { RowId } from "flashcards/flashcards/types/rowData";
import { customHistory } from "modules/router";
import { getDeckByIdRequired } from "flashcards/flashcards/stores/base/functions";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { getPlaintextFromUnformattedVocabularyEntry } from "flashcards/flashcards/stores/deck/compile/format/format";
import { values } from "modules/typescript/objectEntries";
import _ from "underscore";
import shortid from "shortid";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";

export const newDeck = () => {
  const id = shortid.generate() as DeckId;
  getFlashcardsStore().decks[id] = new deckStore({
    deckId: id,
    settings: {},
    rows: {},
  });
  customHistory.replace(`/flashcards/deck/${id}`);
};

export const addRow = (deckId: DeckId) => {
  const rowId = shortid.generate() as RowId;
  /* Todo */
  const rowNumber = 0;
  getDeckByIdRequired(deckId).rows[rowId] = new rowStore(
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
