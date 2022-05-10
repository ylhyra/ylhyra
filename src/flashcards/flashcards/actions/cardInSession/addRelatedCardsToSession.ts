import {isInSession} from "flashcards/flashcards/actions/card/card";
import {dependencyDepthOfCard} from "flashcards/flashcards/actions/card/cardDependencies";
import {CardInSession} from "flashcards/flashcards/actions/cardInSession";
import {printWord} from "flashcards/flashcards/actions/functions";
import {loadCardsIntoSession} from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import {CardIds} from "flashcards/flashcards/types/types";
import {log} from "modules/log";
import {days} from "modules/time";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 */
export const addRelatedCardsToSession = (card: CardInSession) => {
  const id = card.cardId;
  let toAdd: CardIds = [];

  /* Bail for repeated failures ... */
  if (card.history.length > 1) return;

  card.getDependenciesAsArrayOfCardIds().forEach((relatedCardId) => {
    /* Ignore cards already in session */
    if (isInSession(relatedCardId)) return;

    /* Add cards with the same row */
    if (dependencyDepthOfCard(id, relatedCardId) === 0) {
      return toAdd.push(relatedCardId);
    }

    /* Ignore cyclical dependencies */
    if (dependencyDepthOfCard(relatedCardId, id) > 0) return;

    if (relatedCardId.wasRowVeryRecentlySeen()) return;

    /* Add cards that this row directly depends on */
    if (
      dependencyDepthOfCard(id, relatedCardId) === 1 &&
      /* Unseen or unknown cards */
      (relatedCardId.isUnseenRow() ||
        relatedCardId.isBad() ||
        (relatedCardId.isFairlyBad() &&
          relatedCardId.timeSinceRowWasSeen()! > 5 * days &&
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
