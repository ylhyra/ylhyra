import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { CardIds, Rating } from "flashcards/flashcards/types/types";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides,
 * previous versions allowed many related cards to share a "term".
 * Returning an array is therefore not necessary currently)
 */
export function getSiblingCards(this: Card): CardIds {
  return this.getAllCardIdsWithSameTerm(
    (siblingCardId) => siblingCardId !== this.cardId
  );
}

export function getSiblingCardsInSession(this: Card): CardInSession[] {
  return (
    this.getSiblingCards()
      // .filter((card) => card.isInSession())
      .map((card) => card.getAsCardInSession())
      .filter(filterEmpty)
  );
}

export function didAnySiblingCardsGetABadRatingInThisSession(this: Card) {
  return this.getSiblingCards().forEach((siblingCard) => {
    return siblingCard.getAsCardInSession()?.history.includes(Rating.BAD);
  });
}
