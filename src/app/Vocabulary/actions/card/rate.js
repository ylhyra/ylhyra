import { average, clamp } from "app/App/functions/math";
import { BAD, GOOD, EASY } from "./index";
import { printWord } from "app/Vocabulary/actions/functions";
import { keepTrackOfUserStatus } from "app/Vocabulary/actions/session/keepTrackOfUserStatus.js";

/**
 * @memberof Card
 */
export default function rate(rating) {
  const card = this;
  const deck = this.session.deck;
  const isNew = card.history.length === 0;
  card.history.unshift(rating);
  card.session.ratingHistory.unshift(rating);
  card.session.cardHistory.unshift(card);
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
    if (card.getScore() && card.getScore() < GOOD) {
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
      // Directly above
      else if (
        card.dependencyDepth[related_card_id] === 1 &&
        (!(related_card_id in deck.schedule) ||
          deck.schedule[related_card_id].score < 1.5)
      ) {
        card.session.loadCards([related_card_id]);
      }
    });
  }

  card.showIn({ interval });
  card.status = Math.round(lastTwoAverage);
  card.postponeRelatedCards(interval);
  card.session.cardTypeLog.unshift(card.from);

  keepTrackOfUserStatus(rating, isNew);
}
