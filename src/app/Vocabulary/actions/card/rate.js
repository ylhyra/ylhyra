import { average, clamp } from "app/App/functions/math";
import { BAD, GOOD, EASY } from "./index";

/**
 * @memberof Card
 */
export default function rate(rating) {
  const card = this;
  card.history.unshift(rating);
  card.session.history.unshift(rating);
  card.lastSeen = card.session.counter;

  /* Score */
  const lastTwoAverage = average(card.history.slice(0, 2));

  /* Schedule */
  let interval;
  if (rating === BAD) {
    interval = 3;
    card.done = false;
    /* User is getting annoyed */
    if (card.history.length > 7) {
      // TODO improve
      interval = 10;
    }
  } else if (rating === GOOD) {
    interval = 200;
    card.done = true;
    if (card.score && card.score < GOOD) {
      interval = 15;
    }
    if (card.history[1] >= GOOD) {
      interval = 200;
    } else if (card.history[1] === BAD) {
      interval = 8;
      card.done = false;
    } else if (card.history[2] === BAD) {
      interval = 15;
    }
  } else if (rating === EASY) {
    interval = 800;
    card.done = true;
  }

  // if(interval)

  /* Add related cards (in case they're missing) */
  if (rating === BAD) {
    Object.keys(card.dependencyDepth).forEach((related_card_id) => {
      if (related_card_id === card.id) return;
      if (card.session.cards.some((j) => j.id === related_card_id)) return;
      // Same term
      if (card.dependencyDepth[related_card_id] === 0) {
        card.session.loadCards([related_card_id]);
      }
    });
  }

  card.showIn({ interval });
  card.status = Math.round(lastTwoAverage);
  card.postponeRelatedCards(interval);
  card.session.cardTypeLog.unshift(card.from);
}
