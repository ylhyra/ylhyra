import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { assert, notNull, shouldEqual } from "test/index";
import { run } from "test/functions";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";

export default {
  "Progress saved upon signup": async () => {
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.signup_logout_login();
    const known2 = PercentageKnownOverall();
    assert(getEasinessLevel() === 0);
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
};
