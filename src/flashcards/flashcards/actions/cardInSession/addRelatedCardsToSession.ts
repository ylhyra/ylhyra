import { isInSession } from "flashcards/flashcards/actions/card/card";
import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCardIds,
} from "flashcards/flashcards/actions/card/cardDependencies";
import {
  isBad,
  isFairlyBad,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import {
  isUnseenTerm,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { CardIds } from "flashcards/flashcards/types/types";
import { log } from "modules/log";
import { days } from "modules/time";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 */
export const addRelatedCardsToSession = (card: CardInSession) => {
  const id = card.id;
  let toAdd: CardIds = [];

  /* Bail for repeated failures ... */
  if (card.history.length > 1) return;

  getDependenciesAsArrayOfCardIds(card.id).forEach((relatedCardId) => {
    /* Ignore cards already in session */
    if (isInSession(relatedCardId)) return;

    /* Add cards with the same term */
    if (dependencyDepthOfCard(id, relatedCardId) === 0) {
      return toAdd.push(relatedCardId);
    }

    /* Ignore cyclical dependencies */
    if (dependencyDepthOfCard(relatedCardId, id) > 0) return;

    if (wasTermVeryRecentlySeen(relatedCardId)) return;

    /* Add cards that this term directly depends on */
    if (
      dependencyDepthOfCard(id, relatedCardId) === 1 &&
      /* Unseen or unknown cards */
      (isUnseenTerm(relatedCardId) ||
        isBad(relatedCardId) ||
        (isFairlyBad(relatedCardId) &&
          timeSinceTermWasSeen(relatedCardId)! > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${printWord(relatedCardId)}" added`);
      toAdd.push(relatedCardId);
    }
  });

  loadCardsIntoSession(toAdd, {
    insertImmediately: true,
  });
};
