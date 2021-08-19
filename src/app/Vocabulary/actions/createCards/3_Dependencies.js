import { hour, day, hours, days } from "app/App/functions/time";
import _ from "underscore";
import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import {
  printWord,
  getCardsWithSameTerm,
} from "app/Vocabulary/actions/functions";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { deck } from "app/Vocabulary/actions/deck";
import { INCR } from "app/Vocabulary/actions/createSchedule";

export default ({ chosen_ids, forbidden_ids }) => {
  /* Dependencies */
  let new_word_order = [];
  withDependencies(chosen_ids).forEach((card_id) => {
    if (forbidden_ids.includes(card_id)) return;
    if (
      /* Already chosen */
      chosen_ids.includes(card_id) ||
      /* Ignore cards that are below user's easiness level */
      (deck.cards[card_id].sortKey >=
        ((deck.isEasinessLevelOn() && deck.easinessLevel) || 0) &&
        /* Dependency that is not known */
        (!(card_id in deck.schedule) ||
          (deck.schedule[card_id].score &&
            deck.schedule[card_id].score <= BAD + INCR)))
    ) {
      return new_word_order.push(card_id);
    }
  });
  return new_word_order;
};
