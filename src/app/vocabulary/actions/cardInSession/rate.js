import { BAD, EASY, GOOD } from "app/vocabulary/actions/cardInSession";
import { addRelatedCards } from "app/vocabulary/actions/cardInSession/addRelatedCards";
import { keepTrackOfEasiness } from "app/vocabulary/actions/easinessLevel";

/**
 * @memberOf CardInSession
 * @this CardInSession
 */
export default function rate(rating) {
  const card = this;
  const timesSeenBeforeInSession = card.history.length;
  card.history.unshift(rating);
  card.session.ratingHistory.unshift(rating);
  card.session.cardHistory.unshift(card);
  card.lastSeen = card.session.counter;
  const lastRating = card.history[1];
  const nextLastRating = card.history[2];

  /* Schedule */
  let interval;
  if (rating === BAD) {
    interval = card.getSessionsSeen() ? 4 : 3;
    if (lastRating === BAD) {
      interval = 3;
      if (nextLastRating === BAD || Math.random() < 0.2) {
        interval = 2;
      }
    }
    card.done = false;
    /* User is getting annoyed */
    if (timesSeenBeforeInSession >= 6 && timesSeenBeforeInSession % 2 === 0) {
      interval = 8;
    }
  } else if (rating === GOOD) {
    interval = 200;
    card.done = true;
    if (lastRating === BAD) {
      interval = 5;
      card.done = false;
    } else if (nextLastRating === BAD) {
      interval = 10;
    } else if (card.isBad() && timesSeenBeforeInSession === 0) {
      interval = 12;
    }
  } else if (rating === EASY) {
    interval = 800;
    card.done = true;
  }

  if (rating === BAD) {
    addRelatedCards(card);
  }

  card.showIn({ interval });
  card.postponeRelatedCards(interval);
  card.session.cardTypeLog.unshift(card.from);

  keepTrackOfEasiness({
    rating,
    isANewCard: !card.isInSchedule() && timesSeenBeforeInSession === 0,
    card,
  });
}
