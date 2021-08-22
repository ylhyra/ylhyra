import { average, clamp } from "app/App/functions/math";
import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import { printWord } from "app/Vocabulary/actions/functions";
import { addRelatedCards } from "./addRelatedCards";

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

  if (rating === BAD) {
    addRelatedCards(card);
  }

  card.showIn({ interval });
  card.postponeRelatedCards(interval);
  card.session.cardTypeLog.unshift(card.from);

  card.session.deck.trackEasiness(rating, isNew);
}
