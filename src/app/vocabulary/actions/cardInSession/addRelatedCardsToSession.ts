import { log } from "app/app/functions/log";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { days } from "app/app/functions/time";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import { isEmpty } from "app/vocabulary/actions/createCards/3_Choose_cards";
import { EASY, GOOD } from "app/vocabulary/actions/card/card_difficulty";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 * @param {CardInSession} card
 */
export const addRelatedCardsToSession = (card) => {
  let to_add = [];
  let deps = [];

  /* Bail for repeated failures ... */
  if (card.history.length > 1) return;

  card.getDependenciesAsArrayOfCards().forEach((related_card) => {
    /* Ignore cards already in session */
    if (related_card.isInSession()) return;

    /* Add cards with the same term */
    if (card.dependencyDepthOfCard(related_card) === 0) {
      return to_add.push(related_card);
    }

    /* Ignore cyclical dependencies */
    if (related_card.dependencyDepthOfCard(card) > 0) return;

    if (related_card.wasTermVeryRecentlySeen()) return;

    /* Add cards that this term directly depends on */
    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      /* Unseen or unknown cards */
      (related_card.isUnseenTerm() ||
        related_card.isBad() ||
        (related_card.isFairlyBad() &&
          related_card.timeSinceTermWasSeen() > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${related_card.printWord()}" added`);
      to_add.push(related_card);
    }
  });

  card.session.loadCardsIntoSession(to_add, {
    insertImmediately: true,
  });
};
