import {
  areCardsBelongingToSameTerm,
  hasDependenciesInCommonWith,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { getCardIdsFromAllDecks } from "flashcards/flashcards/flashcardsStore.functions";
import { getSession } from "flashcards/flashcards/sessionStore";
import { CardId, CardIds } from "flashcards/flashcards/types/types";

export const isInSession = (cardId: CardId) => {
  return getSession().cards.some((i) => i.cardId === cardId);
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
          areCardsBelongingToSameTerm(cardId, card.cardId) ||
          hasDependenciesInCommonWith(cardId, card.cardId)
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
  const cardInSession = getSession().cards.find(
    (card) => card.cardId === cardId
  );
  return cardInSession && cardInSession.history.length > 0;
};
