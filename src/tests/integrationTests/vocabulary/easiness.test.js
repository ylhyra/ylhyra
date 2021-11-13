import { deck } from "app/vocabulary/actions/deck";
import { assert, notNull, shouldEqual } from "tests/integrationTests/index";
import { run } from "tests/integrationTests/recipes";
import { getEasinessLevel } from "app/vocabulary/actions/easinessLevel/functions";
import { DEFAULT_JUMP_DOWN } from "app/vocabulary/actions/easinessLevel";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/card/card_difficulty";

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
    notNull(getEasinessLevel());
    const checkIfCardsAreAboveEasinessLevel = () => {
      const cardsStillInSession = deck.session.cards.filter(
        (card) =>
          !card.done &&
          (!card.hasBeenSeenInSession() || card.history.includes(BAD)) &&
          card.getRanking() < 2000
      );
      assert(
        cardsStillInSession.length > 0 &&
          cardsStillInSession.every((i) => i.sortKey >= getEasinessLevel()),
        `Expected easiness level to be below ${getEasinessLevel()}, got:`,
        cardsStillInSession.map((i) => i.sortKey).sort((a, b) => a - b)
      );
    };
    checkIfCardsAreAboveEasinessLevel();
    const v1 = deck.session.currentCard.sortKey;
    await run.continue_vocabulary_session({
      values: [BAD, GOOD],
    });
    assert(
      getEasinessLevel() <= v1 - DEFAULT_JUMP_DOWN,
      "Easiness level was not lowered"
    );
    checkIfCardsAreAboveEasinessLevel();
  },
};
