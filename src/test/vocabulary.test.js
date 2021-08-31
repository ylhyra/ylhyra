import { EASY } from "app/Vocabulary/actions/card";
import { deck } from "app/Vocabulary/actions/deck";
import { PercentageKnownOverall } from "app/Vocabulary/actions/functions/percentageKnown";
import { getUserData } from "app/Vocabulary/actions/sync.js";
import { assert, notNull, shouldEqual } from "test/index.js";
import { run } from "test/run";

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
    async () => {},
};
