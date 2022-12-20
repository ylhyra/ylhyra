import {
  CardInSession,
  IntervalRelativeToCurrentCardBeingAtZero,
} from "flashcards/flashcards/actions/cardInSession";
import { addRelatedCardsToSession } from "flashcards/flashcards/actions/cardInSession/addRelatedCardsToSession";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { Rating } from "flashcards/flashcards/types";

/**
 * Called from the user interface in {@link CardElement}, the user is here rating
 * how well he knew a card
 */
export function rate(this: CardInSession, rating: Rating): void {
  const session = this.session;
  const card: CardInSession = this;
  const timesSeenBeforeInSession = card.ratingHistory.length;

  const lastRating = card.lastRating;
  const nextLastRating = card.nextLastRating;
  let interval: IntervalRelativeToCurrentCardBeingAtZero;

  if (rating === Rating.BAD) {
    interval = Math.random() < 0.5 ? 3 : 4;

    if (lastRating >= Rating.GOOD) {
      interval += 2;
    }

    /* User is getting annoyed */
    if (timesSeenBeforeInSession >= 6 && Math.random() < 0.2) {
      interval = 8;
    }

    card.done = false;
    addRelatedCardsToSession(card);
  } else if (rating === Rating.GOOD) {
    interval = 200;
    card.done = true;
    if (lastRating === Rating.BAD) {
      interval = Math.random() < 0.5 ? 5 : 8;
      card.done = false;
    } else if (nextLastRating === Rating.BAD) {
      interval = 12;
    }
    // else if (isBad(card) && timesSeenBeforeInSession === 0) {
    //   interval = 12;
    // }
  } else if (rating === Rating.EASY) {
    interval = 800;
    card.done = true;
  }

  card.showIn({ interval: interval! });

  /** This must come before {@link postponeRelatedCards} */
  card.ratingHistory.unshift(rating);
  session.history.add(card, rating);
  card.postponeRelatedCards(interval!);

  // keepTrackOfEasiness({
  //   rating,
  //   isANewCard: !isInSchedule(id,) && timesSeenBeforeInSession === 0,
  //   card,
  // });

  nextCard();
}
