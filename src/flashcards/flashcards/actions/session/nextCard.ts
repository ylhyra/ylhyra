import { store } from "flashcards/store";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { debugSession } from "flashcards/flashcards/actions/session/functions/debugging";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/functions/saveOngoingSessionInLocalStorage";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { action } from "mobx";
import { clearTimeMemoized } from "modules/time";
import _ from "underscore";

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
    return sessionDone();
  }

  if (!session.areThereUnseenCardsRemaining()) {
    session.cardChooser!.run();
  }

  if (session.cards.length === 0) {
    session.userFacingError = "Failed to generate cards";
    return;
  }

  session.currentCard = _.min(session.cards, (card) =>
    card.getRanking(),
  ) as CardInSession;

  saveOngoingSessionInLocalStorage();
  debugSession();
});
