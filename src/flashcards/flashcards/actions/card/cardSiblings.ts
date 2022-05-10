import {Card, isInSession} from "flashcards/flashcards/actions/card/card";
import {getCardIdsFromTermId} from "flashcards/flashcards/actions/card/term";
import {CardInSession} from "flashcards/flashcards/actions/cardInSession";
import {getTermIdFromCardId} from "flashcards/flashcards/actions/deck/compile/ids";
import {CardId, CardIds, Rating} from "flashcards/flashcards/types/types";
import {filterEmpty} from "modules/typescript/filterEmpty";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides,
 * previous versions allowed many related cards to share a "term".
 * Returning an array is therefore not necessary currently)
 */
export function getSiblingCards(this: Card): CardIds {
  return id.getAllCardIdsWithSameTerm((
    (siblingCardId) => siblingCardId !== id
  );
}

/**
 * Returns both sides of this term (including the input card)
 */
export function getAllCardIdsWithSameTerm(this: Card): CardIds {
  return getCardIdsFromTermId(getTermIdFromCardId(cardId));
}

export function getSiblingCardsInSession(
  this: Card,
  id: CardId
): CardInSession[] {
  return this.getSiblingCards()
    .filter((card) => card.isInSession())
    .map((card) => card.getAsCardInSession())
    .filter(filterEmpty);
}

export function didAnySiblingCardsGetABadRatingInThisSession(
  this: Card,
) {
  return this.getSiblingCards().forEach((siblingCard) => {
    return siblingCard.getAsCardInSession()?.history.includes(Rating.BAD);
  });
}
