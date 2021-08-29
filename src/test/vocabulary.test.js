import { deck } from "app/Vocabulary/actions/deck";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";
import { updateURL } from "app/Router/actions";
import {
  mock_login,
  mock_signup,
  mock_vocabulary_session,
  shouldEqual,
  reset,
  wait,
} from "test/index.js";

export default {
  "Progress saved upon signup": async () => {
    await mock_vocabulary_session();
    const known1 = PercentageKnownOverall();
    const username = await mock_signup();
    await reset();
    await mock_login(username);
    const known2 = PercentageKnownOverall();
    shouldEqual(known1, known2);
  },
};
