import { CardIds, ProcessedDeck } from "flashcards/flashcards/types/types";
import { action } from "mobx";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { entries, keys, values } from "modules/typescript/objectEntries";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export const initializeFlashcardsStore = action(() => {
  const decks = getFromLocalStorage("decks") || {};
  entries(decks).forEach(([deckId, data]) => {
    getFlashcardsStore().decks[deckId] = new deckStore(data);
  });
});

export const saveFlashcardsStore = () => {
  throw new Error("Not implemented");
  saveInLocalStorage("decks", getFlashcardsStore().OLDdecks);
};

export const getDeckById = (id: string | undefined): deckStore | undefined => {
  if (id && id in getFlashcardsStore().OLDdecks) {
    return getFlashcardsStore().decks[id];
  }
};

export const getDeckByIdRequired = (id: string | undefined): deckStore => {
  const _deck = getDeckById(id);
  if (!_deck) {
    throw new Error(`Deck with id ${id} not found`);
  }
  return _deck;
};

/**
 * @deprecated
 */
export const getCardIdsFromAllDecks = (): CardIds => {
  let out: CardIds = [];
  values(getFlashcardsStore().decks).forEach((deck) => {
    out = out.concat(keys(deck.cards));
  });
  return out;
};

/**
 * @deprecated
 */
export const getTermsFromAllDecks = (): ProcessedDeck["terms"] => {
  let out: ProcessedDeck["terms"] = {};
  values(getFlashcardsStore().OLDprocessedDecks).forEach((deck) => {
    entries(deck.terms).forEach(([termId, termInfo]) => {
      out[termId] = termInfo;
    });
  });
  return out;
};
