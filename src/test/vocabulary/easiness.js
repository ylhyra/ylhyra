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
  "Easiness level correctly saved": async () => {
    await run.vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
    });
    const e1 = getUserData("easinessLevel");
    await run.signup_logout_login();
    notNull(e1);
    shouldEqual(e1, getUserData("easinessLevel"));
  },
  "Easiness level works": async () => {
    await run.vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
      dontEnd: true,
    });
    const e1 = getUserData("easinessLevel");
  },
};
