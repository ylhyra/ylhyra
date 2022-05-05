import { isInSession } from "flashcards/flashcards/actions/card/card";
import { getCardIdsFromTermId } from "flashcards/flashcards/actions/card/term";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/sessionStore";
import { CardId, CardIds, Rating } from "flashcards/flashcards/types/types";
import { filterEmpty } from "modules/typescript/filterEmpty";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";

export const getSiblingCards = (id: CardId): CardIds => {
  return getAllCardIdsWithSameTerm(id).filter(
    (siblingCardId) => siblingCardId !== id
  );
};

export const getSiblingCardsInSession = (id: CardId): Array<CardInSession> => {
  return getSiblingCards(id)
    .filter((card) => isInSession(card))
    .map((card) => getAsCardInSession(card))
    .filter(filterEmpty);
};

export const getAsCardInSession = (id: CardId): CardInSession | undefined => {
  return getSession().cards?.find((card) => card.id === id);
};

export const didAnySiblingCardsGetABadRatingInThisSession = (id: CardId) => {
  return getSiblingCards(id).some((siblingCardId) => {
    return getAsCardInSession(siblingCardId)?.history.includes(Rating.BAD);
  });
};

export const getAllCardIdsWithSameTerm = (cardId: CardId): CardIds => {
  return getCardIdsFromTermId(getTermIdFromCardId(cardId));
};
