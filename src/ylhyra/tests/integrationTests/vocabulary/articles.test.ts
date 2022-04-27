import _ from "underscore";
import { assert } from "ylhyra/tests/integrationTests/index";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import {
  printWord,
  studyParticularIds,
} from "ylhyra/vocabulary/app/actions/functions";
import { CardIds } from "ylhyra/vocabulary/types";

export default {
  "Study particular ids": async () => {
    const cardIds = _.shuffle(Object.keys(deck!.cards)).slice(0, 4) as CardIds;
    await studyParticularIds(cardIds);
    assert(
      cardIds.every((cardId) =>
        deck!.session.cards!.some((card) => cardId === card.id)
      ),
      `\nExpected session to include\n> ${cardIds
        .map(printWord)
        .join(", ")}\nbut got \n> ${deck!.session
        .cards!.map((c) => printWord(c.id))
        .join(", ")}`
    );
  },
};
