import { log } from "app/app/functions/log";

/*
  If a cardInSession gets a bad rating, then we make sure
  to add very related cards the session.
*/
export const addRelatedCards = (card) => {
  let to_add = [];
  card.getDependenciesAsArrayOfCards().forEach((related_card) => {
    // Ignore cards already in session
    if (card.session.cards.some((j) => j.getId() === related_card.getId()))
      return;

    // Add cards with the same term
    if (card.dependencyDepthOfCard(related_card) === 0) {
      return to_add.push(related_card);
    }

    // Ignore cyclical dependencies
    if (related_card.dependencyDepthOfCard(card) > 0) {
      return;
    }
    console.log(related_card);
    console.log(card.dependencyDepthOfCard(related_card));

    // Add cards that this term directly depends on
    if (
      card.dependencyDepthOfCard(related_card) === 1 &&
      related_card.isUnseenOrNotGood()
    ) {
      log(`Direct dependency "${related_card.printWord()}" added`);
      to_add.push(related_card);
    }
  });
  if (to_add.length) {
    card.session.loadCardsIntoSession(to_add, {
      insertImmediately: true,
    });
  }
};
