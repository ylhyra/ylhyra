import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { createCards } from "flashcards/flashcards/actions/createCards";
import { debugSession } from "flashcards/flashcards/actions/session/debugging";
import {
  createCardsIfNoneAreRemaining,
  getRemainingTime,
} from "flashcards/flashcards/actions/session/functions";
import { saveOngoingSessionInLocalStorage } from "flashcards/flashcards/actions/session/saveOngoingSessionInLocalStorage";
import { sessionDone } from "flashcards/flashcards/actions/session/sessionDone";
import { getTermIdFromCardId } from "flashcards/flashcards/compile/ids";
import { getSession } from "flashcards/flashcards/sessionStore";
import { log } from "modules/log";
import _ from "underscore";

/**
 * Finds the next CardInSession (based on its {@link getRanking})
 * and then sets it as the session's currentCard.
 *
 * @param depth - Used to prevent infinite calls
 */
export const nextCard = (depth = 0) => {
  const session = getSession();

  /** Todo: The counter is updated here at the top, which is perhaps slightly confusing? */
  session.counter++;

  if (getRemainingTime() === 0) {
    sessionDone();
    return;
  }

  if (session.cards.length === 0) {
    log("No cards");
    createCards();
    /* Prevent infinite calls */
    if (depth === 0) {
      nextCard(1);
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

  session.termsSeen.add(getTermIdFromCardId(session.currentCard.cardId));

  saveOngoingSessionInLocalStorage();
  debugSession();
};
