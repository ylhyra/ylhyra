import { eraseCookie } from "app/app/functions/cookie";
import { EASY } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { getUserData } from "app/vocabulary/actions/sync";
import { assert, notNull, shouldEqual } from "test/index";
import { run } from "test/functions";
import { studyParticularIds } from "app/vocabulary/actions/functions";
import _ from "underscore";
import { printWord } from "app/vocabulary/actions/functions";

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
