import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { debugSession } from "flashcards/flashcards/actions/session/functions/debugging";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { clearTimeMemoized } from "modules/time";
import _ from "underscore";
import { seedRandomNumberGenerator } from "modules/randomNumber";

/**
 * Finds the next CardInSession (based on its {@link getRanking})
 * and then sets it as the session's currentCard.
 *
 * (The reason this isn't a method of Session is that it was causing a circular dependency issue)
 */
export function nextCard() {
  const session = getSession();

  /**
   * The counter is updated here at the top since we have now moved to the
   * next slot and are trying to find a card to fill that slot.
   */
  session.counter++;
  clearTimeMemoized();
  seedRandomNumberGenerator();
  session.timer.updateRemainingTime();

  if (session.timer.remainingTime === 0) {
    return sessionDone();
  }

  if (!session.areThereNewCardsRemaining()) {
    createCards();
  }

  if (session.cards.length === 0) {
    throw new Error("Failed to generate cards");
  }

  session.currentCard = _.min(session.cards, (card) =>
    card.getRanking()
  ) as CardInSession;

  saveOngoingSessionInLocalStorage();
  debugSession();
}
