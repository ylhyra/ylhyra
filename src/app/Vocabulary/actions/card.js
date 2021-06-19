import { average, clamp } from "app/App/functions/math";
import { getWordFromId, getRelatedCardIds } from "./_functions";

export const BAD = 1;
export const GOOD = 2;
export const EASY = 3;

class Card {
  constructor(data, index, session) {
    this.session = session;
    this.progress = 0;
    this.history = [];
    this.goodRepetitions = 0;
    this.absoluteQueuePosition = index;
    Object.assign(this, data);
  }
  rate(rating) {
    this.history.unshift(rating);
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
    this.absoluteQueuePosition = this.session.counter + interval;
    this.lastInterval = interval;

    this.status = Math.round(lastTwoAverage);

    // if (this.history.length >= 6) {
    //   this.done = true
    // }

    /* Postpone related cards */
    const card = this;
    card.terms.forEach((term) => {
      card.session.cards.forEach((_card) => {
        if (_card.id === card.id) return;
        if (_card.terms.includes(term)) {
          let max = 300;
          if (
            (_card.score && _card.score < GOOD) ||
            card.history.includes(BAD) ||
            _card.history.includes(BAD)
          ) {
            max = 10;
          }
          const newPosition = _card.session.counter + Math.min(interval, max);
          if (newPosition > _card.absoluteQueuePosition) {
            _card.absoluteQueuePosition = newPosition;
          }
        }
      });
    });

    /* Add related cards (in case they're missing) */
    if (rating === BAD) {
      // getRelatedCardIds(card.id)
      //   .filter(sibling_id => !card.session.cards.some(j => j.id === sibling_id))
      //   .forEach(sibling_id => {
      //     /* TODO */
      //   })
    }

    this.session.cardTypeLog.unshift(this.from);
  }
  getRanking() {
    let q = this.getQueuePosition();

    /* New terms are not relevant unless there are no overdue cards */
    if (!this.terms.some((term) => term in this.session.lastSeenTerms)) {
      q = this.absoluteQueuePosition + 1000;
    } else {

    /* Seen cards */
      /* Seen cards are not relevant if they are not overdue */
      if (q > 0) {
        q += 2000;
      }
    }

    /* A bad card that is due exactly now has priority */
    if (
      this.history[0] === BAD &&
      q === 0 &&
      this.session.counter % 2 ===
        0 /* (But not always, to prevent staleness) */
    ) {
      q -= 50;
    }

    // /* Bad cards first */
    // if (
    //   this.history.length > 0 &&
    //   this.history[0] >= GOOD &&
    //   this.session.counter % 3 < 2 /* (But not always, to prevent staleness) */
    // ) {
    //   q += 20
    // }

    if (this.ticksSinceTermWasSeen() < 2) {
      q += 5000 - this.ticksSinceTermWasSeen();
    }
    if (this.done) {
      q += 700;
    }
    /* Prevent rows of the same card type from appearing right next to each other */
    if (
      this.session.cardTypeLog[0] === this.from &&
      (this.history.length > 0 ||
        this.sessions_seen > 0) /* TODO verify sessions_seen is set */
    ) {
      q += 0.4;
      if (this.session.cardTypeLog[1] === this.from) {
        q += 5;
        // if (this.session.cardTypeLog[2] === this.from) {
        //   q += 2000
        // }
      }
    }
    return q;
  }
}

Card.prototype.getQueuePosition = function () {
  return this.absoluteQueuePosition - this.session.counter;
};
Card.prototype.ticksSinceTermWasSeen = function () {
  let last_seen = null;
  this.terms.forEach((term) => {
    if (
      this.session.lastSeenTerms[term] &&
      (last_seen === null || last_seen > this.session.lastSeenTerms[term])
    ) {
      last_seen = this.session.lastSeenTerms[term];
    }
  });
  if (last_seen) {
    return this.session.counter - last_seen;
  } else {
    return this.session.cards.length;
  }
};
Card.prototype.getStatus = function () {
  if (!this.lastSeen) return null;
  return this.status;
};
Card.prototype.shouldShowHint = function () {
  const lastTwoAverage = average(this.history.slice(0, 2));
  return !(
    this.history[0] === EASY ||
    (this.history.length >= 2 && lastTwoAverage >= GOOD)
  );
};

export default Card;
