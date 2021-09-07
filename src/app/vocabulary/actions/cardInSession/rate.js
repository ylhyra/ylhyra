import { BAD, EASY, GOOD } from "app/vocabulary/actions/cardInSession";
import { addRelatedCards } from "app/vocabulary/actions/cardInSession/addRelatedCards";
import { keepTrackOfEasiness } from "app/vocabulary/actions/easinessLevel";

/**
 * @module CardInSession
 */
export default function rate(rating) {
  const card = this;
  const isNew = card.history.length === 0;
  card.history.unshift(rating);
  card.session.ratingHistory.unshift(rating);
  card.session.cardHistory.unshift(card);
  card.lastSeen = card.session.counter;

  /* Schedule */
  let interval;
  if (rating === BAD) {
    interval = 3;
    if (card.history[1] === BAD) {
      if (card.history[2] === BAD || Math.random() < 0.5) {
        interval = 2;
      }
    }
    card.done = false;
    /* User is getting annoyed */
    if (card.history.length > 7) {
      // TODO improve
      interval = 8;
    }
  } else if (rating === GOOD) {
    interval = 200;
    card.done = true;
    if (card.getScore() && card.getScore() === BAD) {
      interval = 12;
    } else if (card.history[1] === BAD) {
      interval = 5;
      card.done = false;
    } else if (card.history[2] === BAD) {
      interval = 10;
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

  keepTrackOfEasiness(rating, isNew);
}
