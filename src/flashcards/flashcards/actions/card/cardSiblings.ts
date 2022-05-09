import { isInSession } from "flashcards/flashcards/actions/card/card";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getTermIdFromCardId } from "flashcards/flashcards/actions/deck/compile/ids";
import { CardId, CardIds, Rating } from "flashcards/flashcards/types/types";
import { filterEmpty } from "modules/typescript/filterEmpty";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides,
 * previous versions allowed many related cards to share a "term".
 * Returning an array is therefore not necessary currently)
 */
export function getSiblingCards(this: Card): CardIds {
  return getAllCardIdsWithSameTerm(id).filter(
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
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card))
    .filter(filterEmpty);
}

export function didAnySiblingCardsGetABadRatingInThisSession(
  this: Card,
  id: CardId
) {
  return getSiblingCards(id).some((siblingCardId) => {
    return getAsCardInSession(siblingCardId)?.history.includes(Rating.BAD);
  });
}
