import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { getEntireSchedule } from "flashcards/flashcards/actions/userData/userDataStore";
import { CardIds } from "flashcards/flashcards/types";

export function getAsCardInSession(this: Card): CardInSession | undefined {
  return getSession().cards?.find((card) => card.cardId === this.cardId);
}

/** @deprecated */
export const getCardsInSchedule = (): Card[] => {
  return filterCardsThatExist(Object.keys(getEntireSchedule()) as CardIds);
};
