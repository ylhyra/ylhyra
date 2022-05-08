import {
  CardIds,
  ProcessedDeck,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { action } from 'mobx';
import { deck } from "flashcards/flashcards/stores/deck/deck";
import { entries, keys, values } from "modules/typescript/objectEntries";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export const initializeFlashcardsStore = action(() => {
  const decks = getFromLocalStorage("decks") || {};
  entries(decks).forEach(([deckId, rows]) => {
    getFlashcardsStore().decks[deckId] = new deck(deckId, rows);
  });
});

export const saveFlashcardsStore = () => {
  throw new Error("Not implemented");
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
