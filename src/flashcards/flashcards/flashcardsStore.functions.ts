import {
  CardIds,
  DeckProcessed,
  UnprocessedDeck,
} from "flashcards/flashcards/types/types";
import { entries, keys, values } from "modules/typescript/objectEntries";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { compileDeck } from "flashcards/flashcards/compile/compile";

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
export const getTermsFromAllDecks = (): DeckProcessed["terms"] => {
  let out: DeckProcessed["terms"] = {};
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
