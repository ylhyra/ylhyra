import {
  hasDependenciesInCommonWith,
  hasTermsInCommonWith,
} from "ylhyra/vocabulary/app/actions/card/card_dependencies";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { CardId, CardIds } from "ylhyra/vocabulary/types";

export function isInSession(id: CardId) {
  return deck!.session.cards.some((i) => i.getId() === id);
}

export function isAllowed(id: CardId) {
  const { allowed_ids } = deck!.session;
  return (
    /* Ignore cards that are already in the session */
    !isInSession(id) &&
    /* If allowed_ids is on, only select allowed cards */
    (!allowed_ids || allowed_ids.includes(id)) &&
    /* In case we're adding cards to an already ongoing session,
         ignore cards that are similar to a card the user has just seen */
    !deck!.session.cardHistory.slice(0, 3).some(
      (card) =>
        hasTermsInCommonWith(id, card.getId()) ||
        hasDependenciesInCommonWith(id, card.getId())
      // || isTextSimilarTo(id, card)
    )
  );
}

export function doesCardExist(id: CardId) {
  return id in deck!.cards;
}

export function filterCardsThatExist(ids: CardIds) {
  return ids.filter(doesCardExist);
}

export function wasSeenInSession(id) {
  return (
    deck!.session.cards.find((card) => card.getId() === id)?.history.length > 0
  );
}
