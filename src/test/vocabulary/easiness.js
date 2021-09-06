import { eraseCookie } from "app/app/functions/cookie";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { getEasinessLevel(), getUserData } from "app/vocabulary/actions/sync";
import { assert, notNull, shouldEqual } from "test/index";
import { run } from "test/functions";
import { studyParticularIds } from "app/vocabulary/actions/functions";
import _ from "underscore";
import { printWord } from "app/vocabulary/actions/functions";

export default {
  "Easiness level correctly saved": async () => {
    await run.vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
    });
    const e1 = getEasinessLevel();
    await run.signup_logout_login();
    notNull(e1);
    shouldEqual(e1, getEasinessLevel());
  },
  "Easiness level works": async () => {
    await run.start_vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
    });
    const e1 = getEasinessLevel();
    notNull(e1);
    assert(
      deck.session.cards.filter((i) => !i.done).every((i) => i.sortKey >= e1),
      `Expected easiness level to be below ${e1}, got:`,
      deck.session.cards.filter((i) => !i.done).map((i) => i.sortKey)
    );
    await run.continue_vocabulary_session({
      values: [BAD, GOOD],
    });
  },
};
