import { eraseCookie } from "app/app/functions/cookie";
import { deck } from "app/vocabulary/actions/deck";
import { assert } from "tests/integrationTests/index";
import { run } from "tests/integrationTests/functions";

export default {
  "Unfinished session correctly scheduled and logged": async () => {
    await run.vocabulary_session({ dontEnd: true });
    await run.fakeReload();
    assert(
      Object.keys(deck.schedule).length > 0,
      "Schedule not saved for a logged out user"
    );
    // TODO logging
  },
  // "Unfinished session not scheduled if user is accidentally logged out":
  //   async () => {
  //     await run.signup();
  //     await run.vocabulary_session({ dontEnd: true });
  //     eraseCookie();
  //     await run.fakeReload();
  //     assert(Object.keys(deck.schedule).length === 0);
  //   },
};
