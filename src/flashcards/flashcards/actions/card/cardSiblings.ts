import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides,
 * previous versions allowed many related cards to share a "row".
 * Returning an array is therefore not necessary currently)
 */
export function getSiblingCards(this: Card): Card[] {
  return this.row.cards.filter((siblingCard) => !siblingCard.is(this));
}

export function getSiblingCardsInSession(this: Card): CardInSession[] {
  return (
    this.getSiblingCards()
      // .filter((card) => card.isInSession())
      .map((card) => card.getAsCardInSession())
      .filter(filterEmpty)
  );
}

export function didAnySiblingCardsGetABadRatingInThisSession(
  this: Card
): boolean {
  return this.getSiblingCards().some((siblingCard) => {
    return siblingCard.getAsCardInSession()?.ratingHistory.includes(Rating.BAD);
  });
}
