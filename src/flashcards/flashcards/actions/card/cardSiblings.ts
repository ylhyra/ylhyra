import { isInSession } from "flashcards/flashcards/actions/card/card";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getTermIdFromCardId } from "flashcards/flashcards/stores/deck/compile/ids";
import { CardId, CardIds, Rating } from "flashcards/flashcards/types/types";
import { filterEmpty } from "modules/typescript/filterEmpty";
import { getAsCardInSession } from "flashcards/flashcards/actions/card/functions";

/**
 * Gets the other side of the card.
 * (Although currently there can only be two sides,
 * previous versions allowed many related cards to share a "term".
 * Returning an array is therefore not necessary currently)
 */
export const getSiblingCards = (id: CardId): CardIds => {
  return getAllCardIdsWithSameTerm(id).filter(
    (siblingCardId) => siblingCardId !== id
  );
};

/**
 * Returns both sides of this term (including the input card)
 */
export const getAllCardIdsWithSameTerm = (cardId: CardId): CardIds => {
  return getCardIdsFromTermId(getTermIdFromCardId(cardId));
};

export const getSiblingCardsInSession = (id: CardId): CardInSession[] => {
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card))
    .filter(filterEmpty);
};

export const didAnySiblingCardsGetABadRatingInThisSession = (id: CardId) => {
  return getSiblingCards(id).some((siblingCardId) => {
    return getAsCardInSession(siblingCardId)?.history.includes(Rating.BAD);
  });
};
