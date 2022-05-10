import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { CardIds, DeckId } from "flashcards/flashcards/types/types";
import { action } from "mobx";
import { flattenArray } from "modules/arrays/flattenArray";
import { getFromLocalStorage, saveInLocalStorage } from "modules/localStorage";
import { entries, values } from "modules/typescript/objectEntries";

export const initializeFlashcardsStore = action(() => {
  const decks = getFromLocalStorage("decks") || {};
  entries(decks).forEach(([deckId, data]) => {
    getFlashcardsStore().decks[deckId as DeckId] = new Deck(data);
  });
});

export const saveFlashcardsStore = () => {
  throw new Error("Not implemented");
  saveInLocalStorage("decks", getFlashcardsStore().decks);
};

export const getDeckById = (id: DeckId | undefined): Deck | undefined => {
  if (id && id in getFlashcardsStore().decks) {
    return getFlashcardsStore().decks[id];
  }
};

export const getDeckByIdRequired = (id: DeckId | undefined): Deck => {
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
export const getRowsFromAllDecks = () => {
  throw new Error("Not implemented");
  // let out: deckStore["rows"] = {};
  // values(getFlashcardsStore().decks).forEach((deck) => {
  //   entries(deck.rows).forEach(([rowId, rowInfo]) => {
  //     out[rowId] = rowInfo;
  //   });
  // });
  // return out;
};
