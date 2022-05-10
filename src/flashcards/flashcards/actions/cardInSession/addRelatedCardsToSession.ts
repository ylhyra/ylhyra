import { Card } from "flashcards/flashcards/actions/card/card";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { loadCardsIntoSession } from "flashcards/flashcards/actions/session/loadCardsIntoSession";
import { log } from "modules/log";
import { days } from "modules/time";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 */
export function addRelatedCardsToSession(currentCard: CardInSession) {
  let toAdd: Card[] = [];

  /* Bail for repeated failures ... */
  if (currentCard.history.length > 1) return;

  currentCard.getDependenciesAsArrayOfCards().forEach((relatedCard): void => {
    /* Ignore cards already in session */
    if (relatedCard.isInSession()) return;

    /* Add cards with the same row */
    if (currentCard.dependencyDepthOfCard(relatedCard) === 0) {
      toAdd.push(relatedCard);
      return;
    }

    /* Ignore cyclical dependencies */
    if (relatedCard.dependencyDepthOfCard(currentCard) > 0) return;

    if (relatedCard.wasRowVeryRecentlySeen()) return;

    /* Add cards that this row directly depends on */
    if (
      currentCard.dependencyDepthOfCard(relatedCard) === 1 &&
      /* Unseen or unknown cards */
      (relatedCard.isUnseenRow() ||
        relatedCard.isBad() ||
        (relatedCard.isFairlyBad() &&
          relatedCard.timeSinceRowWasSeen()! > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${relatedCard.printWord()}" added`);
      toAdd.push(relatedCard);
    }
  });

  /** Todo: insertImmediately doesn't actually do anything in regards to getRanking as these are new cards */
  loadCardsIntoSession(toAdd, {
    insertImmediately: true,
  });
}
