import { getTermIds } from "flashcards/flashcards/play/actions/card/card_data";
import CardInSession from "flashcards/flashcards/play/actions/cardInSession";
import { createCards } from "flashcards/flashcards/play/actions/createCards";
import { debugSession } from "flashcards/flashcards/play/actions/session/debugging";
import {
  createCardsIfNoneAreRemaining,
  updateRemainingTime,
} from "flashcards/flashcards/play/actions/session/functions";
import { saveSessionInLocalStorage } from "flashcards/flashcards/play/actions/session/sessionSaveLocalStorage";
import { getSession } from "flashcards/flashcards/play/actions/session/sessionStore";
import { log } from "modules/log";
import _ from "underscore";

/**
 * @param depth - Used to prevent infinite calls
 */
export function nextCard(depth = 0) {
  const session = getSession();

  session.counter++;
  updateRemainingTime();
  if (session.done) return;
  if (session.cards.length === 0) {
    log("No cards");
    createCards();
    /* Prevent infinite calls */
    if (depth === 0) {
      nextCard(1);
    } else {
      throw new Error("Failed to generate cards");
      // TODO User-facing error?
    }
    return;
  } else {
    createCardsIfNoneAreRemaining();
  }

  session.currentCard = _.min(session.cards, (i) =>
    i.getRanking()
  ) as CardInSession;

  /* Store when session.term was last seen */
  getTermIds(session.currentCard.getId()).forEach((termId) => {
    session.lastSeenTerms[termId] = session.counter;
  });

  saveSessionInLocalStorage();
  debugSession();
}
