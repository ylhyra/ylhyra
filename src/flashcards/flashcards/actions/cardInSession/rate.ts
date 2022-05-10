import {
  CardInSession,
  IntervalRelativeToCurrentCardBeingAtZero,
} from "flashcards/flashcards/actions/cardInSession";
import { addRelatedCardsToSession } from "flashcards/flashcards/actions/cardInSession/addRelatedCardsToSession";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { Rating } from "flashcards/flashcards/types";

/**
 * Called from the user interface in {@link CardElement},
 * the user is here rating how well he knew a card
 */
export function rate(this: CardInSession, rating: Rating): void {
  const session = getSession();

  const card: CardInSession = this;
  const timesSeenBeforeInSession = card.history.length;
  card.history.unshift(rating);
  session.ratingHistory.unshift(rating);
  session.cardHistory.unshift(card);
  card.lastSeenAtCounter = session.counter;
  const lastRating = card.history[1];
  const nextLastRating = card.history[2];
  let interval: IntervalRelativeToCurrentCardBeingAtZero;

  if (rating === Rating.BAD) {
    interval = card.getSessionsSeen() > 0 ? 4 : 3;

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

    card.done = false;
    addRelatedCardsToSession(card);
  } else if (rating === Rating.GOOD) {
    interval = 200;
    card.done = true;
    if (lastRating === Rating.BAD) {
      interval = 5;
      card.done = false;
    } else if (nextLastRating === Rating.BAD) {
      interval = 10;
    } else if (card.isBad() && timesSeenBeforeInSession === 0) {
      interval = 12;
    }
  } else if (rating === Rating.EASY) {
    interval = 800;
    card.done = true;
  }

  card.showIn({ interval: interval! });
  card.postponeRelatedCards(interval!);
  session.cardDirectionLog.unshift(card.direction);

  // keepTrackOfEasiness({
  //   rating,
  //   isANewCard: !id.isInSchedule() && timesSeenBeforeInSession === 0,
  //   card,
  // });

  nextCard();
  if (!session.done) {
    // session.loadCardInInterface();
  }
}
