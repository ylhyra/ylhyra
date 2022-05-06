import { isBad } from "flashcards/flashcards/actions/card/cardDifficulty";
import { getSessionsSeen } from "flashcards/flashcards/actions/card/cardSchedule";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { addRelatedCardsToSession } from "flashcards/flashcards/actions/cardInSession/addRelatedCardsToSession";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getDirectionFromCardId } from "flashcards/flashcards/compile/ids";
import { Rating } from "flashcards/flashcards/types/types";

/**
 * Called from the user interface in {@link CardElement},
 * the user is here rating how well he knew a card
 */
export function rate(this: CardInSession, rating: Rating): void {
  const cardInSession: CardInSession = this;
  const id = cardInSession.id;
  const timesSeenBeforeInSession = cardInSession.history.length;
  cardInSession.history.unshift(rating);
  cardInSession.session.ratingHistory.unshift(rating);
  cardInSession.session.cardHistory.unshift(cardInSession);
  cardInSession.lastSeen = cardInSession.session.counter;
  const lastRating = cardInSession.history[1];
  const nextLastRating = cardInSession.history[2];
  let interval;

  if (rating === Rating.BAD) {
    interval = getSessionsSeen(id) > 0 ? 4 : 3;

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
  } else if (rating === Rating.GOOD) {
    interval = 200;
    cardInSession.done = true;
    if (lastRating === Rating.BAD) {
      interval = 5;
      cardInSession.done = false;
    } else if (nextLastRating === Rating.BAD) {
      interval = 10;
    } else if (isBad(id) && timesSeenBeforeInSession === 0) {
      interval = 12;
    }
  } else if (rating === Rating.EASY) {
    interval = 800;
    cardInSession.done = true;
  }

  if (rating === Rating.BAD) {
    addRelatedCardsToSession(cardInSession);
  }

  cardInSession.showIn({ interval });
  cardInSession.postponeRelatedCards(interval);
  cardInSession.session.cardTypeLog.unshift(getDirectionFromCardId(id));

  // keepTrackOfEasiness({
  //   rating,
  //   isANewCard: !isInSchedule(id) && timesSeenBeforeInSession === 0,
  //   card,
  // });

  nextCard();
  if (!this.session.done) {
    // session.loadCardInInterface();
  }
}
