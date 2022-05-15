import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { CardId } from "flashcards/flashcards/types";

export function getAsCardInSession(this: Card): CardInSession | undefined {
  return getSession().cards?.find((card) => card.is(this));
}

export function wasSeenInSession(this: Card) {
  const cardInSession = this.getAsCardInSession();
  return cardInSession && cardInSession.ratingHistory.length > 0;
}

export const getCardById = (id: CardId): Card => {
  throw new Error("Not implemented");
};

export function isInSession(this: Card) {
  return this.isIn(getSession().cards);
}
