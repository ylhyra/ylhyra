import {
  hasDependenciesInCommonWith,
  hasTermsInCommonWith,
} from "ylhyra/app/vocabulary/actions/card/card_dependencies";
import { CardId, CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import { deck } from "ylhyra/app/vocabulary/actions/deck";

export const clearMemoizations = (id: CardId) => {
  // ["isAllowed", "getTermLastSeen"].forEach((key) => {
  //   if (getMemoizeKey(key) in this) {
  //     delete getMemoizeKey(id, key)];
  //   }
  // });
};

// memoize(key, func) {
//   key = getMemoizeKey(key);
//   if (this[key] === undefined) {
//     this[key] = func.call(this);
//   }
//   return this[key];
// }

// export const isIn = (id: CardId, arrayOfCards) => {
//   return arrayOfCards.some((s) => s === id);
// };

export const isInSession = (id: CardId) => {
  return deck!.session.cards.some((i) => i.getId() === id);
};

export const isAllowed = (id: CardId) => {
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
