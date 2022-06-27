import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCards,
} from "flashcards/flashcards/actions/card/cardDependencies";
import { Card } from "flashcards/flashcards/actions/card/card";
import {
  isBad,
  isFairlyBad,
} from "flashcards/flashcards/actions/card/cardDifficulty";
import {
  isUnseenRow,
  timeSinceRowWasSeen,
  wasRowVeryRecentlySeen,
} from "flashcards/flashcards/actions/card/cardSchedule";
import { isInSession } from "flashcards/flashcards/actions/card/functions";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { log } from "modules/log";
import { days } from "modules/time";

/**
 * If a cardInSession gets a bad rating, then we make
 * sure to add very related cards to the session.
 */
export function addRelatedCardsToSession(currentCard: CardInSession) {
  let toAdd: Card[] = [];

  /* Bail for repeated failures ... */
  if (currentCard.ratingHistory.length > 1) return;

  getDependenciesAsArrayOfCards(currentCard).forEach((relatedCard): void => {
    /* Ignore cards already in session */
    if (isInSession(relatedCard)) return;

    /* Add cards with the same row */
    if (dependencyDepthOfCard(currentCard, relatedCard) === 0) {
      toAdd.push(relatedCard);
      return;
    }

    /* Ignore cyclical dependencies */
    if (dependencyDepthOfCard(relatedCard, currentCard) > 0) return;

    if (wasRowVeryRecentlySeen(relatedCard)) return;

    /* Add cards that this row directly depends on */
    if (
      dependencyDepthOfCard(currentCard, relatedCard) === 1 &&
      /* Unseen or unknown cards */
      (isUnseenRow(relatedCard) ||
        isBad(relatedCard) ||
        (isFairlyBad(relatedCard) &&
          timeSinceRowWasSeen(relatedCard)! > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${printWord(relatedCard)}" added`);
      toAdd.push(relatedCard);
    }
  });

  /**
   * Todo: insertImmediately doesn't actually do anything
   * in regards to getRanking as these are new cards
   */
  loadCardsIntoSession(toAdd, {
    insertImmediately: true,
  });
}
