import { average, clamp } from "app/App/functions/math";
import {
  printWord,
  getCardsWithSameTerm,
} from "app/Vocabulary/actions/_functions.js";
import _ from "underscore";
import getRanking from "app/Vocabulary/actions/card/getRanking";
import rate from "app/Vocabulary/actions/card/rate";
import postponeRelatedCards from "app/Vocabulary/actions/card/postponeRelatedCards";

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
}

Card.prototype.rate = rate;
Card.prototype.getRanking = getRanking;
Card.prototype.postponeRelatedCards = postponeRelatedCards;

Card.prototype.getQueuePosition = function () {
  return this.absoluteQueuePosition - this.session.counter;
};
Card.prototype.showIn = function ({ interval }) {
  if (!interval) return;
  this.absoluteQueuePosition = this.session.counter + interval;
};
// Card.prototype.ticksSinceTermWasSeen = function () {
//   let last_seen = null;
//   this.terms.forEach((term) => {
//     if (
//       this.session.lastSeenTerms[term] &&
//       (last_seen === null || last_seen > this.session.lastSeenTerms[term])
//     ) {
//       last_seen = this.session.lastSeenTerms[term];
//     }
//   });
//   if (last_seen) {
//     return this.session.counter - last_seen;
//   } else {
//     return this.session.cards.length;
//   }
// };
Card.prototype.wasDependencyRecentlySeen = function () {
  /* TODO: Af hverju veldur "1" því að síðustu tveir séu skoðaðir? */
  // const length = this.session.counter % 2 ? 2 : 1;
  return (
    _.intersection(
      this.dependencies,
      _.flatten(this.session.dependencyHistory.slice(0, 1))
    ).length > 0
  );
};

Card.prototype.getStatus = function () {
  if (!this.lastSeen) return null;
  return this.status;
};
// Card.prototype.shouldShowHint = function () {
//   const lastTwoAverage = average(this.history.slice(0, 2));
//   return !(
//     this.history[0] === EASY ||
//     (this.history.length >= 2 && lastTwoAverage >= GOOD)
//   );
// };

export default Card;
