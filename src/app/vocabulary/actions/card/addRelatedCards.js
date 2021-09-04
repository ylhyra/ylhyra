import { BAD } from "app/vocabulary/actions/card";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";

/*
  If a card gets a bad rating, then we make sure
  to add very related cards the session.
*/
export const addRelatedCards = (card) => {
  Object.keys(card.dependenciesAndSameTerm).forEach((related_card_id) => {
    if (related_card_id === card.id) return;
    if (card.session.cards.some((j) => j.id === related_card_id)) return;
    // Add cards with the same term
    if (card.dependenciesAndSameTerm[related_card_id] === 0) {
      card.session.loadCards([related_card_id]);
    }
    // Add cards that this term directly depends on
    else if (
      card.dependenciesAndSameTerm[related_card_id] === 1 &&
      // TODO Ignore cyclical dependencies
      // !(deck.cards[related_card_id].dependencies) &&

      (!(related_card_id in deck.schedule) ||
        deck.schedule[related_card_id].score <= BAD + INCR * 2)
    ) {
      console.log(`Direct dependency "${printWord(related_card_id)}" added`);
      card.session.loadCards([related_card_id]);
    }
  });
};
