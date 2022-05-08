import {
  hasDependenciesInCommonWith,
  hasTheSameTermAs,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { getCardIdsFromAllDecks } from "flashcards/flashcards/stores/base/functions";
import { getSession } from "flashcards/flashcards/stores/session";
import { CardId, CardIds } from "flashcards/flashcards/types/types";

export const isInSession = (cardId: CardId) => {
  return getSession().cards.some((i) => i.cardId === cardId);
};

/**
 * Whether a card is allowed to be chosen by {@link createCards}
 * to be added to the session.
 */
export const isAllowed = (cardId: CardId): boolean => {
  /* Ignore cards that are already in the session */
  if (isInSession(cardId)) return false;

  /* If allowedIds is on, only select allowed cards */
  const { allowedIds } = getSession();
  if (allowedIds && !allowedIds.includes(cardId)) return false;

  /* In case we're adding cards to an already ongoing session,
     ignore cards that are similar to a card the user has just seen */
  if (
    getSession()
      .cardHistory.slice(0, 3)
      .some(
        (card) =>
          hasTheSameTermAs(cardId, card.cardId) ||
          hasDependenciesInCommonWith(cardId, card.cardId)
        // || isTextSimilarTo(id, card)
      )
  )
    return false;

  return true;
};

export const filterCardsThatExist = (cardIds: CardIds) => {
  const cardsThatExist = getCardIdsFromAllDecks();
  return cardIds.filter((cardId) => cardId in cardsThatExist);
};

export const wasSeenInSession = (cardId: CardId) => {
  const cardInSession = getSession().cards.find(
    (card) => card.cardId === cardId
  );
  return cardInSession && cardInSession.history.length > 0;
};
