import { getCardIdsFromAllDecks } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import { CardId, CardIds } from "flashcards/flashcards/types";

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

export function getAsCardInSession(this: Card): CardInSession | undefined {
  return getSession().cards?.find((card) => card.cardId === this.cardId);
}

export const filterCardsThatExist = (cardIds: CardIds) => {
  const cardsThatExist = getCardIdsFromAllDecks();
  return cardIds.filter((cardId) => cardId in cardsThatExist);
};

export const getCardsInSchedule = (): CardIds => {
  return filterCardsThatExist(Object.keys(getEntireSchedule()) as CardIds);
};
