import { CardIds, DeckId } from "flashcards/flashcards/types/types";
import { action } from "mobx";
import { deckStore } from "flashcards/flashcards/stores/deck/deckStore";
import { entries, values } from "modules/typescript/objectEntries";
import { flattenArray } from "modules/arrays/flattenArray";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";

export const initializeFlashcardsStore = action(() => {
  const decks = getFromLocalStorage("decks") || {};
  entries(decks).forEach(([deckId, data]) => {
    getFlashcardsStore().decks[deckId as DeckId] = new deckStore(data);
  });
});

export const saveFlashcardsStore = () => {
  throw new Error("Not implemented");
  saveInLocalStorage("decks", getFlashcardsStore().decks);
};

export const getDeckById = (id: DeckId | undefined): deckStore | undefined => {
  if (id && id in getFlashcardsStore().decks) {
    return getFlashcardsStore().decks[id];
  }
};

export const getDeckByIdRequired = (id: DeckId | undefined): deckStore => {
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
  return flattenArray(
    values(getFlashcardsStore().decks).map((deck) => deck.getCardIds())
  );
};

/**
 * @deprecated
 */
export const getTermsFromAllDecks = () => {
  throw new Error("Not implemented");
  // let out: deckStore["terms"] = {};
  // values(getFlashcardsStore().decks).forEach((deck) => {
  //   entries(deck.terms).forEach(([termId, termInfo]) => {
  //     out[termId] = termInfo;
  //   });
  // });
  // return out;
};
