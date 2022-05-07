import { compileDeck } from "flashcards/flashcards/compile/compile";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import {
  CardIds,
  ProcessedDeck,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries, keys, values } from "modules/typescript/objectEntries";

export const loadDecks = () => {
  getFlashcardsStore().decks = getFromLocalStorage("decks") || {};
};

export const saveDecks = () => {
  saveInLocalStorage("decks", getFlashcardsStore().decks);
};

export const getDeckById = (
  id: string | undefined
): UnprocessedDeck | undefined => {
  if (id && id in getFlashcardsStore().decks) {
    return getFlashcardsStore().decks[id];
  }
};

export const getDeckByIdRequired = (
  id: string | undefined
): UnprocessedDeck => {
  const deck = getDeckById(id);
  if (!deck) {
    throw new Error(`Deck with id ${id} not found`);
  }
  return deck;
};

/**
 * Todo: Refactor, somehow merge
 */
export const getProcessedDeckById = (
  id: string | undefined
): ProcessedDeck | undefined => {
  if (id && id in getFlashcardsStore().processedDecks) {
    return getFlashcardsStore().processedDecks[id];
  }
};

/**
 * @deprecated
 */
export const getCardIdsFromAllDecks = (): CardIds => {
  let out: CardIds = [];
  values(getFlashcardsStore().processedDecks).forEach((deck) => {
    out = out.concat(keys(deck.cards));
  });
  return out;
};

/**
 * @deprecated
 */
export const getTermsFromAllDecks = (): ProcessedDeck["terms"] => {
  let out: ProcessedDeck["terms"] = {};
  values(getFlashcardsStore().processedDecks).forEach((deck) => {
    entries(deck.terms).forEach(([termId, termInfo]) => {
      out[termId] = termInfo;
    });
  });
  return out;
};

/* tmp */
export const tempInitializeDecks = () => {
  loadDecks();
  values(getFlashcardsStore().decks).forEach((deck) => {
    getFlashcardsStore().processedDecks[deck.deckId] = compileDeck(deck);
  });
};
