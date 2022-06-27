import { Card } from "flashcards/flashcards/actions/card/card";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { Rating } from "flashcards/flashcards/types";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides, previous
 * versions allowed many related cards to share a "row".
 * Returning an array is therefore not necessary currently)
 */
export function getSiblingCards(card1: Card): Card[] {
  return card1.row.cards.filter((siblingCard) => !siblingCard.is(card1));
}

export function getSiblingCardsInSession(card1: Card): CardInSession[] {
  return (
    getSiblingCards(card1)
      // .filter((card) => isInSession(card,))
      .map((card) => getAsCardInSession(card))
      .filter(filterEmpty)
  );
}

export function didAnySiblingCardsGetABadRatingInThisSession(
  card1: Card
): boolean {
  return getSiblingCards(card1).some((siblingCard) => {
    return getAsCardInSession(siblingCard)?.ratingHistory.includes(Rating.BAD);
  });
}
