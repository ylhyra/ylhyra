import { deck } from "app/vocabulary/actions/deck";
import { assert } from "tests/integration/index";
import {
  printWord,
  studyParticularIds,
} from "app/vocabulary/actions/functions";
import _ from "underscore";

export default {
  "Study particular ids": async () => {
    const card_ids = _.shuffle(Object.keys(deck.cards)).slice(0, 4);
    await studyParticularIds(card_ids);
    assert(
      card_ids.every((card_id) =>
        deck.session.cards.some((card) => card_id === card.id)
      ),
      `\nExpected session to include\n> ${card_ids
        .map(printWord)
        .join(", ")}\nbut got \n> ${deck.session.cards
        .map((c) => printWord(c.id))
        .join(", ")}`
    );
  },
};
