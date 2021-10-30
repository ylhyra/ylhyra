import { log } from "app/app/functions/log";
import { EASY, GOOD } from "app/vocabulary/actions/cardInSession/index";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { days } from "app/app/functions/time";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 * @param {CardInSession} card
 */
export const addRelatedCardsToSession = (card) => {
  let to_add = [];
  card.getDependenciesAsArrayOfCards().forEach((related_card) => {
    /* Ignore cards already in session */
    if (related_card.isInSession()) return;

    /* Add cards with the same term */
    if (card.dependencyDepthOfCard(related_card) === 0) {
      return to_add.push(related_card);
    }

    /* Ignore cyclical dependencies */
    if (related_card.dependencyDepthOfCard(card) > 0) return;

    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      related_card.isUnseenTerm()
    ) {
      log(`ajjaja "${related_card.printWord()}" added`);
    }

    /* Add cards that this term directly depends on */
    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      // Math.random() > 0.5 &&
      /* Unseen or unknown cards */
      (related_card.isUnseenTerm() ||
        related_card.isBad() ||
        (related_card.isFairlyBad() &&
          related_card.timeSinceTermWasSeen() > 2 * days &&
          Math.random() > 0.8) ||
        /* Cards that the user has seen only once but said they knew well */
        (related_card.getSessionsSeen() === 1 &&
          !(related_card.getScore() >= EASY) &&
          related_card.timeSinceTermWasSeen() > 10 * days &&
          Math.random() > 0.8) ||
        /* Cards that the user has said Good to
           but which they haven't seen in a few days */
        (related_card.getScore() <= GOOD &&
          related_card.timeSinceTermWasSeen() > 10 * days))
      // Math.random() > 0.9
    ) {
      log(`Direct dependency "${related_card.printWord()}" added`);
      to_add.push(related_card);
    }
  });

  card.session.loadCardsIntoSession(to_add, {
    insertImmediately: true,
  });
};
