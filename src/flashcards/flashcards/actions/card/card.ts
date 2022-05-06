import {
  hasDependenciesInCommonWith,
  hasTermsInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { getSession } from "flashcards/flashcards/sessionStore";
import { CardId, CardIds } from "flashcards/flashcards/types/types";
import { getCardIdsFromAllDecks } from "flashcards/flashcards/flashcardsStore.functions";

export const isInSession = (cardId: CardId) => {
  return getSession().cards.some((i) => i.id === cardId);
};

export const isAllowed = (cardId: CardId) => {
  const { allowedIds } = getSession();
  return (
    /* Ignore cards that are already in the session */
    !isInSession(cardId) &&
    /* If allowedIds is on, only select allowed cards */
    (!allowedIds ||
      allowedIds.includes(
        cardId
      )) /* In case we're adding cards to an already ongoing session,
         ignore cards that are similar to a card the user has just seen */ &&
    !getSession()
      .cardHistory.slice(0, 3)
      .some(
        (card) =>
          hasTermsInCommonWith(cardId, card.id) ||
          hasDependenciesInCommonWith(cardId, card.id)
        // || isTextSimilarTo(id, card)
      )
  );
};

export const doesCardExist = (cardId: CardId) => {
  return cardId in getCardIdsFromAllDecks();
};

export const filterCardsThatExist = (cardIds: CardIds) => {
  return cardIds.filter(doesCardExist);
};

export const wasSeenInSession = (cardId: CardId) => {
  const cardInSession = getSession().cards.find((card) => card.id === cardId);
  return cardInSession && cardInSession.history.length > 0;
};
