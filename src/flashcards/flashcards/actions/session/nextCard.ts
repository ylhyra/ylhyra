import { store } from "flashcards/store";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { debugSession } from "flashcards/flashcards/actions/session/functions/debugging";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { action } from "mobx";
import { clearTimeMemoized } from "modules/time";
import _ from "underscore";
import { categorizeCardsAndLoadIntoSession } from "flashcards/flashcards/actions/createCards/cardChooser";
import {
  isNewRow,
  isOverdueGood,
  isOverdueBad,
} from "flashcards/flashcards/actions/card/cardSchedule";

/**
 * Finds the next CardInSession (based on its {@link getRanking}) and then sets
 * it as the session's currentCard.
 *
 * (The reason this isn't a method of Session is that it was causing a circular
 * dependency issue)
 */
export const nextCard = action(() => {
  const session = store.session;

  /**
   * The counter is updated here at the top since we have now moved to the next
   * slot and are trying to find a card to fill that slot.
   */
  session.counter++;
  session.timer.updateRemainingTime();
  clearTimeMemoized();

  if (session.timer.remainingTime === 0) {
    return sessionDone({ restart: true });
  }

  // /* If all allowedCards are already in use, clear it */
  // if (session.allowedCards?.every((card) => isInSession(card))) {
  //   session.allowedCards = undefined;
  //   logDev("allowedCards cleared");
  // }

  if (!session.areThereUnseenCardsRemaining()) {
    categorizeCardsAndLoadIntoSession(session.chosenDeck!);
    console.warn("New cards loaded");
  }

  if (session.cards.length === 0) {
    session.userFacingError = "Failed to generate cards";
    return;
  }

  const chosenCard = _.min(
    session.cards.filter((card) => card.canBeShown),
    (card) => card.getRanking(),
  );

  if (chosenCard instanceof CardInSession) {
    if (isNewRow(chosenCard)) {
      session.addedCardLog.unshift("NEW");
    } else if (isOverdueGood(chosenCard)) {
      session.addedCardLog.unshift("OVERDUE_GOOD");
    } else if (isOverdueBad(chosenCard)) {
      session.addedCardLog.unshift("OVERDUE_BAD");
    } else {
      console.warn("Switched to non-overdue!!!");
    }

    session.currentCard = chosenCard;
  } else {
    console.error("No cards! Ending session");
    return sessionDone({ restart: true });
  }

  saveOngoingSessionInLocalStorage();
  debugSession();
});
