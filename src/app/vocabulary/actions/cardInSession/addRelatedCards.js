import { log } from "app/app/functions/log";
import { days, now } from "app/app/functions/time";

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
        related_card.getSessionsSeen() === 1 ||
        /* Cards that the user has seen only once but said they knew well */
        (related_card.getScore() < GOOD + INCR &&
          related_card.getTermLastSeen() < now() - 3 * days))
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
