import { log } from "app/app/functions/log";
import { EASY, GOOD } from "app/vocabulary/actions/cardInSession/index";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { days } from "app/app/functions/time";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";
import { sortBySortKey } from "app/vocabulary/actions/createCards/functions";
import { isEmpty } from "app/vocabulary/actions/createCards/3_Choose_cards";

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

    /* Add cards that this term directly depends on */
    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      /* Unseen or unknown cards */
      (related_card.isUnseenTerm() ||
        related_card.isBad() ||
        (related_card.isFairlyBad() &&
          related_card.timeSinceTermWasSeen() > 5 * days &&
          Math.random() > 0.8))
      // /* Cards that the user has seen only once but said they knew well */
      // (related_card.getSessionsSeen() === 1 &&
      //   !(related_card.getScore() >= EASY) &&
      //   related_card.timeSinceTermWasSeen() > 10 * days &&
      //   Math.random() > 0.8) ||
      // /* Cards that the user has said Good to
      //    but which they haven't seen in a few days */
      // (related_card.getScore() &&
      //   related_card.getScore() <= GOOD &&
      //   related_card.timeSinceTermWasSeen() > 15 * days &&
      //   Math.random() > 0.7)
    ) {
      log(`Direct dependency "${related_card.printWord()}" added`);
      to_add.push(related_card);
      // deps.push(related_card);
    }
  });

  // if (!isEmpty(deps)) {
  //   deps = sortBySortKey(deps).reverse().slice(0, 2).reverse();
  //   deps.forEach((j) => {
  //     log(`Direct dependency "${j.printWord()}" added`);
  //   });
  //   to_add = to_add.concat(deps);
  // }

  card.session.loadCardsIntoSession(to_add, {
    insertImmediately: true,
  });
};
