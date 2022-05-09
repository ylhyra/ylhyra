import { Card } from "flashcards/flashcards/actions/card/card";
import { CardId, CardIds } from "flashcards/flashcards/types/types";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getCardIdsFromAllDecks } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { getSession } from "flashcards/flashcards/actions/session/session";

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

export function getAsCardInSession(
  this: Card,
  id: CardId
): CardInSession | undefined {
  return getSession().cards?.find((card) => card.cardId === id);
}

export const filterCardsThatExist = (cardIds: CardIds) => {
  const cardsThatExist = getCardIdsFromAllDecks();
  return cardIds.filter((cardId) => cardId in cardsThatExist);
};
