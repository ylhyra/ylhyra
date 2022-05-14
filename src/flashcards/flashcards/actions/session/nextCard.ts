import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { debugSession } from "flashcards/flashcards/actions/session/functions/debugging";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { Session } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { clearTimeMemoized } from "modules/time";
import _ from "underscore";

/**
 * Finds the next CardInSession (based on its {@link getRanking})
 * and then sets it as the session's currentCard.
 */
export function nextCard(this: Session) {
  /**
   * The counter is updated here at the top since we have now moved to the
   * next slot and are trying to find a card to fill that slot.
   */
  this.counter++;
  clearTimeMemoized();
  this.timer.updateRemainingTime();

  if (this.timer.remainingTime === 0) {
    return sessionDone();
  }

  if (!this.areThereNewCardsRemaining()) {
    createCards();
  }

  this.currentCard = _.min(this.cards, (card) =>
    card.getRanking()
  ) as CardInSession;

  saveOngoingSessionInLocalStorage();
  debugSession();
}
