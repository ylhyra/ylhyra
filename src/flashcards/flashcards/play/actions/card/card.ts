import {
  hasDependenciesInCommonWith,
  hasTermsInCommonWith,
} from "flashcards/flashcards/play/actions/card/card_dependencies";

export const isInSession = (id: CardId) => {
  return deck!.session.cards.some((i) => i.getId() === id);
};

export const isAllowed = (id: CardId) => {
  const { allowedIds } = deck!.session;
  return (
    /* Ignore cards that are already in the session */
    !isInSession(id) &&
    /* If allowedIds is on, only select allowed cards */
    (!allowedIds || allowedIds.includes(id)) &&
    /* In case we're adding cards to an already ongoing session,
         ignore cards that are similar to a card the user has just seen */
    !deck!.session.cardHistory.slice(0, 3).some(
      (card) =>
        hasTermsInCommonWith(id, card.getId()) ||
        hasDependenciesInCommonWith(id, card.getId())
      // || isTextSimilarTo(id, card)
    )
  );
};

export const doesCardExist = (id: CardId) => {
  return id in deck!.cards;
};

export const filterCardsThatExist = (ids: CardIds) => {
  return ids.filter(doesCardExist);
};

export const wasSeenInSession = (id) => {
  return (
    deck!.session.cards.find((card) => card.getId() === id)?.history.length > 0
  );
};
