import { BAD, EASY, GOOD } from "app/vocabulary/actions/cardInSession";
import { deck } from "app/vocabulary/actions/deck";
import { assert, notNull, shouldEqual } from "test/index";
import { run } from "test/functions";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";
import { DEFAULT_JUMP_DOWN } from "app/vocabulary/actions/easinessLevel";
import { DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL } from "app/vocabulary/actions/createCards/4_Dependencies";

export default {
  "Easiness level correctly saved": async () => {
    await run.vocabulary_session({
      values: [EASY, EASY, EASY, EASY, EASY, EASY, EASY],
    });
    let e1 = getEasinessLevel();
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
    const check = () => {
      const cardsStillInSession = deck.session.cards.filter(
        (card) =>
          !card.done &&
          (!card.hasBeenSeenInSession() || card.history.includes(BAD)) &&
          card.getQueuePosition() < 1000
      );
      assert(
        cardsStillInSession.length > 0 &&
          cardsStillInSession.every(
            (i) =>
              i.sortKey >= e1 - DEPENDENCIES_CAN_BE_X_LOWER_THAN_EASINESS_LEVEL
          ),
        `Expected easiness level to be below ${e1}, got:`,
        cardsStillInSession.map((i) => i.sortKey)
      );
    };
    check();
    const v1 = deck.session.currentCard.sortKey;
    await run.continue_vocabulary_session({
      values: [BAD, GOOD],
    });
    assert(
      getEasinessLevel() <= v1 - DEFAULT_JUMP_DOWN,
      "Easiness level was not lowered"
    );
    check();
  },
};
