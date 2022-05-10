import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";

export function getAsCardInSession(this: Card): CardInSession | undefined {
  return getSession().cards?.find((card) => card.is(this));
}
