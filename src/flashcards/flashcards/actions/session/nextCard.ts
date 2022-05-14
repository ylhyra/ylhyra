import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { debugSession } from "flashcards/flashcards/actions/session/functions/debugging";
import { createCardsIfNoneAreRemaining } from "flashcards/flashcards/actions/session/functions/functions";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { action } from "mobx";
import { log } from "modules/log";
import _ from "underscore";

/**
 * Finds the next CardInSession (based on its {@link getRanking})
 * and then sets it as the session's currentCard.
 *
 * @param isRecursiveCall - Used to prevent infinite calls
 */
export const nextCard = action((isRecursiveCall = false) => {
  const session = getSession();

  /**
   * The counter is updated here at the top since we have now moved to the
   * next slot and are trying to find a card to fill that slot.
   */
  session.increaseCounterAndClearCaches();

  if (session.timer.remainingTime === 0) {
    sessionDone();
    return;
  }

  if (session.cards.length === 0) {
    log("No cards");
    createCards();
    /* Prevent infinite calls */
    if (!isRecursiveCall) {
      nextCard(true);
      return;
    } else {
      console.error("Failed to create cards");
      session.userFacingError = "Failed to create cards";
      return;
    }
  } else {
    createCardsIfNoneAreRemaining();
  }

  session.currentCard = _.min(session.cards, (i) =>
    i.getRanking()
  ) as CardInSession;

  session.history.rowsSeen.add(session.currentCard.rowId);

  saveOngoingSessionInLocalStorage();
  debugSession();
});
