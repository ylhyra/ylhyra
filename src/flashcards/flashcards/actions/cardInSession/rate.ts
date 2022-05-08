import { isBad } from "flashcards/flashcards/actions/card/cardDifficulty";
import { getSessionsSeen } from "flashcards/flashcards/actions/card/cardSchedule";
import {
  CardInSession,
  IntervalRelativeToCurrentCardBeingAtZero,
} from "flashcards/flashcards/actions/cardInSession";
import { addRelatedCardsToSession } from "flashcards/flashcards/actions/cardInSession/addRelatedCardsToSession";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getDirectionFromCardId } from "flashcards/flashcards/compile/ids";
import { getSession } from "flashcards/flashcards/stores/session";
import { Rating } from "flashcards/flashcards/types/types";

/**
 * Called from the user interface in {@link CardElement},
 * the user is here rating how well he knew a card
 */
export function rate(this: CardInSession, rating: Rating): void {
  const session = getSession();

  const cardInSession: CardInSession = this;
  const cardId = cardInSession.cardId;
  const timesSeenBeforeInSession = cardInSession.history.length;
  cardInSession.history.unshift(rating);
  session.ratingHistory.unshift(rating);
  session.cardHistory.unshift(cardInSession);
  cardInSession.lastSeenAtCounter = session.counter;
  const lastRating = cardInSession.history[1];
  const nextLastRating = cardInSession.history[2];
  let interval: IntervalRelativeToCurrentCardBeingAtZero;

  if (rating === Rating.BAD) {
    interval = getSessionsSeen(cardId) > 0 ? 4 : 3;

    /* Two bad ratings in a row */
    if (lastRating === Rating.BAD) {
      interval = 3;
      // Three bad ratings in a row always get an interval of 2
      if (nextLastRating === Rating.BAD) {
        interval = 2;
      }
      // But two bad ratings in a row also occasionally get an interval of 2
      else if (Math.random() < 0.2) {
        interval = 2;
      }
    }

    /* User is getting annoyed */
    if (timesSeenBeforeInSession >= 6 && timesSeenBeforeInSession % 2 === 0) {
      interval = 8;
    }

    cardInSession.done = false;
    addRelatedCardsToSession(cardInSession);
  } else if (rating === Rating.GOOD) {
    interval = 200;
    cardInSession.done = true;
    if (lastRating === Rating.BAD) {
      interval = 5;
      cardInSession.done = false;
    } else if (nextLastRating === Rating.BAD) {
      interval = 10;
    } else if (isBad(cardId) && timesSeenBeforeInSession === 0) {
      interval = 12;
    }
  } else if (rating === Rating.EASY) {
    interval = 800;
    cardInSession.done = true;
  }

  cardInSession.showIn({ interval: interval! });
  cardInSession.postponeRelatedCards(interval!);
  session.cardDirectionLog.unshift(getDirectionFromCardId(cardId));

  // keepTrackOfEasiness({
  //   rating,
  //   isANewCard: !isInSchedule(id) && timesSeenBeforeInSession === 0,
  //   card,
  // });

  nextCard();
  if (!session.done) {
    // session.loadCardInInterface();
  }
}
