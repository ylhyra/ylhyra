import { BAD, GOOD, EASY } from "./index";

/**
 * @memberof Card
 */
export default function getRanking() {
  /* Queue position relative to zero */
  let q = this.absoluteQueuePosition - this.session.counter;
  let canBeShown = this.canBeShown();

  if (!this.terms) {
    console.log(this);
    throw new Error("getRanking called on an uninitialized card");
    return;
  }

  /* New terms are not relevant unless there are no overdue cards */
  if (!this.terms.some((term) => term in this.session.lastSeenTerms)) {
    q = this.absoluteQueuePosition + 1000;
  } else {
    /* Seen cards */
    /* Seen cards are not relevant if they are not overdue */
    if (q > 0 && canBeShown) {
      q += 2000;
    }
  }
  if (!canBeShown) {
    q += 3000;
  }

  /* A bad card that is due exactly now has priority */
  if (
    this.history[0] === BAD &&
    q === 0 &&
    this.session.counter % 2 === 0 /* (But not always, to prevent staleness) */
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

  // if (this.ticksSinceTermWasSeen() < 2 || this.wasDependencyRecentlySeen()) {
  //   q += 5000 - this.ticksSinceTermWasSeen();
  // }
  // if (this.wasDependencyRecentlySeen()) {
  //   q += 5000;
  // }

  if (this.done) {
    q += 700;
  }
  /* Prevent rows of the same card type from appearing right next to each other too often */
  if (
    this.session.cardTypeLog[0] === this.from &&
    (this.history.length > 0 ||
      this.sessions_seen > 0) /* TODO verify sessions_seen is set */
  ) {
    q += 0.4;
    if (this.session.cardTypeLog[1] === this.from) {
      q += 5;
      if (
        this.session.cardTypeLog[2] === this.from &&
        !this.session.history.slice(0, 3).some((i) => i === BAD)
      ) {
        q += 2000;
      }
    }
  }
  return q;
}
