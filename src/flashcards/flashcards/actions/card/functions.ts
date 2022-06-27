import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { CardId } from "flashcards/flashcards/types";

export function getAsCardInSession(card1: Card): CardInSession | undefined {
  return getSession().cards?.find((card) => card.is(card1));
}

export function wasSeenInSession(card1: Card) {
  const cardInSession = getAsCardInSession(card1);
  return cardInSession && cardInSession.ratingHistory.length > 0;
}

export function getCardById(id: CardId): Card {
  throw new Error("Not implemented");
}

export function isInSession(card1: Card) {
  return card1.isIn(getSession().cards);
}
