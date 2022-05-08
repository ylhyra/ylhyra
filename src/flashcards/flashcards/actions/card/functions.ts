import { CardId } from "flashcards/flashcards/types/types";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/stores/sessionStore";

/**
 * Used for testing
 */
export const getCardIdByText = (text: string): CardId => {
  throw new Error("Not implemented");
  // const id = (getHashForVocabulary(text) + "_is") as CardId;
  // // const id = getCardsFromAllDecks()[(getHashForVocabulary(text) + "_is") as CardId]?.id;
  // if (!(id in getCardsFromAllDecks()))
  //   throw new Error(`No card found with text "${text}", id would be ${id}`);
  // return id;
};

export const getAsCardInSession = (id: CardId): CardInSession | undefined => {
  return getSession().cards?.find((card) => card.cardId === id);
};
