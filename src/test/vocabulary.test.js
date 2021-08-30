import { deck } from "app/Vocabulary/actions/deck";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";
import { updateURL } from "app/Router/actions";
import { run, shouldEqual, reset, wait } from "test/index.js";
import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";

export default {
  "Progress saved upon signup": async () => {
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.signup_logout_login();
    const known2 = PercentageKnownOverall();
    shouldEqual(known1, known2);
  },
  "Vocabulary same after having logged out": async () => {
    await run.signup();
    await run.vocabulary_session();
    const known1 = PercentageKnownOverall();
    await run.reset_and_login();
    const known2 = PercentageKnownOverall();
    shouldEqual(known1, known2);
  },
  "Easiness level": async () => {
    await run.vocabulary_session(EASY, EASY, EASY, EASY, EASY, EASY, EASY);
    const e1 = deck.easinessLevel;
    await run.signup_logout_login();
    shouldEqual(e1, deck.easinessLevel);
  },
  // Unfinished session correctly scheduled and logged
  // Unfinished session not scheduled if user is accidentally logged out
};
