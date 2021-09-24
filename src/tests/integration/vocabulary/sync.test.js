import { PercentageKnownOverall } from "app/vocabulary/actions/functions/percentageKnown";
import { assert, notNull, shouldEqual, wait } from "tests/integration/index";
import { run } from "tests/integration/functions";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";

export default {
  "Progress saved upon signup": async () => {
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.signup_logout_login();
    // await wait(200);
    const known2 = PercentageKnownOverall();
    assert(getEasinessLevel() === 0);
    notNull(known1, known2);
    shouldEqual(known1, known2);
  },
  "Vocabulary same after having logged out and logged in": async () => {
    await run.signup();
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.reset_and_login();
    const known2 = PercentageKnownOverall();
    notNull(known1, known2);
    shouldEqual(known1, known2);
  },
  "Vocabulary empty on log out": async () => {
    await run.signup();
    await run.vocabulary_session();
    await run.logout();
    shouldEqual(PercentageKnownOverall(), 0);
  },
};
