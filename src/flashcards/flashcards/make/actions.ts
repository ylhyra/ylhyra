import { getPlaintextFromUnformattedVocabularyEntry } from "flashcards/flashcards/make/format/format";
import { isBrowser } from "modules/isBrowser";
import _hash from "modules/hash";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { RowId } from "flashcards/flashcards/types/row";
import { customHistory } from "modules/router";
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

export const addLine = (deckId: string) => {
  const rowId = shortid.generate() as RowId;
  /* Todo */
  const rowNumber = 0;
  getFlashcardsStore().decks[deckId].rows[rowId] = {
    rowId,
    rowNumber,
  };
  return rowId;
};

/**
 * Gives a stable hash for a given word or sentence
 * which is then used as the card's {@link TermId}.
 *
 * Important: The output of this function has to be
 * the same as for previous versions.
 *
 * @param input -
 *   Typically an Icelandic string (front side of card).
 *   Lemmas and depends_on are also passed into this function.
 * @param options
 * @returns string - which is the base of {@link TermId}
 * @hasTests
 */
export const getHashForVocabulary = (
  input: string[] | string,
  options?: { skip_hash?: Boolean }
): string => {
  if (!input) return "";
  if (Array.isArray(input)) {
    return getHashForVocabulary(
      input.map(getPlaintextFromUnformattedVocabularyEntry).join(";")
    );
  }
  const string = getPlaintextFromUnformattedVocabularyEntry(input)
    .replace(/[.?!]+$/, "")
    .toLowerCase();
  if (!string) return "";
  /** Todo: This has to be removed from here, but it is used to find missing entries */
  if (
    options?.skip_hash ||
    (isBrowser &&
      ("skip_hash" in window || window.location.pathname === "/maker"))
  ) {
    return string;
  }
  return _hash(string);
};

export const getHashesFromCommaSeperated = (i: string[] | string): string[] => {
  if (!i) return [];
  if (Array.isArray(i)) {
    return i.map((i) => getHashForVocabulary(i));
  }
  return i
    .split(",")
    .map((i) => getHashForVocabulary(i))
    .filter(Boolean);
};
