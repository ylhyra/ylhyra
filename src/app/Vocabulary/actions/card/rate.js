import { average, clamp } from "app/App/functions/math";
import { BAD, GOOD, EASY } from "./index";

/**
 * @memberof Card
 */
export default function rate(rating) {
  this.history.unshift(rating);
  this.session.history.unshift(rating);
  this.lastSeen = this.session.counter;

  /* Score */
  const lastTwoAverage = average(this.history.slice(0, 2));
  this.score = Math.floor(lastTwoAverage);

  if (rating !== BAD) {
    this.goodRepetitions++;
  }

  /* Schedule */
  let interval;
  if (rating === BAD) {
    interval = 3;
    this.done = false;
    /* User is getting annoyed */
    if (this.history.length > 10) {
      // TODO improve
      interval = 10;
    }
  } else if (rating === GOOD) {
    interval = 200;
    this.done = true;
    if (this.score && this.score < GOOD) {
      interval = 15;
    }
    if (this.history[1] >= GOOD) {
      interval = 200;
    } else if (this.history[1] === BAD) {
      interval = 8;
      this.done = false;
    } else if (this.history[2] === BAD) {
      interval = 15;
    }
  } else if (rating === EASY) {
    interval = 800;
    this.done = true;
  }
  this.showIn({ interval });

  this.status = Math.round(lastTwoAverage);

  this.postponeRelatedCards(interval);

  /* Add related cards (in case they're missing) */
  if (rating === BAD) {
    // getCardsWithSameTerm(card.id)
    //   .filter(sibling_id => !card.session.cards.some(j => j.id === sibling_id))
    //   .forEach(sibling_id => {
    //     /* TODO */
    //   })
  }

  this.session.cardTypeLog.unshift(this.from);
  // this.session.dependencyHistory = [
  //   this.dependencies,
  //   ...this.session.dependencyHistory,
  // ].slice(0, 2);
}
