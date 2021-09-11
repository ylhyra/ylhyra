import { log } from "app/app/functions/log";
import { days, now } from "app/app/functions/time";
import { GOOD } from "app/vocabulary/actions/cardInSession/index";
import { INCR } from "app/vocabulary/actions/createSchedule";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards the session.
 * @param {CardInSession} card
 */
export const addRelatedCards = (card) => {
  let to_add = [];
  card.getDependenciesAsArrayOfCards().forEach((related_card) => {
    // Ignore cards already in session
    if (related_card.isIn(card.session.cards)) return;

    // Add cards with the same term
    if (card.dependencyDepthOfCard(related_card) === 0) {
      return to_add.push(related_card);
    }

    // Ignore cyclical dependencies
    if (related_card.dependencyDepthOfCard(card) > 0) return;

    // Add cards that this term directly depends on
    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      /* Unseen or unknown cards */
      (related_card.isUnseenOrNotGood() ||
        /* Cards that the user has seen only once but said they knew well */
        related_card.getSessionsSeen() === 1 ||
        /* Cards that the user has said Good to twice
           but which they haven't seen in a few days */
        (related_card.getScore() <= GOOD + INCR &&
          related_card.daysSinceTermWasSeen() > 1) ||
        /* Very well known cards are occasionally shown */
        (Math.random() < 0.2 && related_card.daysSinceTermWasSeen() > 7))
    ) {
      log(`Direct dependency "${related_card.printWord()}" added`);
      to_add.push(related_card);
    }
  });

  if (to_add.length > 0) {
    card.session.loadCardsIntoSession(to_add, {
      insertImmediately: true,
    });
  }
};
