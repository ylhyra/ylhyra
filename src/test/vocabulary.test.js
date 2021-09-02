import { eraseCookie } from "app/app/functions/cookie";
import { EASY } from "app/vocabulary/actions/card";
import { deck } from "app/vocabulary/actions/deck";
import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { getUserData } from "app/vocabulary/actions/sync";
import { assert, notNull, shouldEqual, wait } from "test/index";
import { run } from "test/run";
import { studyParticularIds } from "app/vocabulary/actions/functions/index";
import _ from "underscore";
import { printWord } from "app/vocabulary/actions/functions";

export default {
  "Progress saved upon signup": async () => {
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.signup_logout_login();
    const known2 = PercentageKnownOverall();
    assert(getUserData("easinessLevel") === 0);
    notNull(known1, known2);
    shouldEqual(known1, known2);
  },
  "Vocabulary same after having logged out": async () => {
    await run.signup();
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.reset_and_login();
    const known2 = PercentageKnownOverall();
    notNull(known1, known2);
    shouldEqual(known1, known2);
  },
  "Easiness level correctly saved": async () => {
    await run.vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
    });
    const e1 = getUserData("easinessLevel");
    await run.signup_logout_login();
    notNull(e1);
    shouldEqual(e1, getUserData("easinessLevel"));
  },
  "Unfinished session correctly scheduled and logged": async () => {
    await run.vocabulary_session({ dontEnd: true });
    await run.fakeReload();
    assert(Object.keys(deck.schedule).length > 0);
    // TODO logging
  },
  "Unfinished session not scheduled if user is accidentally logged out":
    async () => {
      await run.signup();
      await run.vocabulary_session({ dontEnd: true });
      eraseCookie();
      await run.fakeReload();
      assert(Object.keys(deck.schedule).length === 0);
    },

  studyParticularIds: async () => {
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
