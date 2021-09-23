import { deck } from "app/vocabulary/actions/deck";
import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { minIgnoreFalsy } from "app/app/functions/math";
import { days, getTime } from "app/app/functions/time";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";

/**
 * @memberOf Card#
 * @returns {Object|undefined}
 */
function getSchedule() {
  return deck.schedule[this.getId()];
}

/**
 * @memberOf Card#
 * @returns {Number|undefined} - Timestamp in milliseconds
 */
function getDue() {
  return this.getSchedule()?.due;
}

/**
 * @memberOf Card#
 * @returns {Number|undefined}
 */
function getScore() {
  return this.getSchedule()?.score;
}

/**
 * @memberOf Card#
 * @returns {Number}
 */
function getSessionsSeen() {
  return this.getSchedule()?.sessions_seen || 0;
}

/**
 * @memberOf Card#
 * @returns {Number|undefined}
 */
function getLastIntervalInDays() {
  return this.getSchedule()?.last_interval_in_days;
}

/**
 * @memberOf Card#
 * @returns {Number|undefined} - Timestamp in milliseconds
 */
function getLastSeen() {
  return this.getSchedule()?.last_seen;
}

/**
 * @memberOf Card#
 * @returns {Boolean|undefined}
 */
function isBad() {
  return this.getScore() === BAD;
}

/**
 * @memberOf Card#
 * @returns {Boolean|undefined}
 */
function isFairlyBad() {
  return this.getScore() && this.getScore() <= BAD + INCR;
}

/**
 * @memberOf Card#
 * @returns {Boolean|undefined}
 */
function isBelowGood() {
  return this.getScore() && this.getScore() < GOOD;
}

/**
 * @memberOf Card#
 * @returns {Boolean}
 */
function isUnseenOrNotGood() {
  return !this.getScore() || this.getScore() < GOOD;
}

/**
 * @memberOf Card#
 * @returns {Boolean}
 */
function isTermUnknownOrNotGood() {
  const lowest = this.getLowestAvailableTermScore();
  return !lowest || lowest < GOOD;
}

/**
 * @memberOf Card#
 * @returns {Number|undefined}
 */
function getLowestAvailableTermScore() {
  let lowest;
  this.getAllCardsWithSameTerm().forEach((card) => {
    if (card.getScore()) {
      lowest = minIgnoreFalsy(lowest, card.getScore());
    }
  });
  return lowest;
}

/**
 * @memberOf Card#
 * @returns {Number|undefined}
 */
function getTermLastSeen() {
  return Math.max(
    ...this.getAllCardsWithSameTerm()
      .map((card) => card.getLastSeen())
      .filter(Boolean)
  );
}

/**
 * @memberOf Card#
 * @returns {number|null} - days
 */
function daysSinceTermWasSeen() {
  if (!this.getTermLastSeen()) return null;
  return (getTime() - this.getTermLastSeen()) / days;
}

/**
 * @memberOf Card#
 * @returns {boolean}
 */
function isInSchedule() {
  return this.getId() in deck.schedule;
}

/**
 * @memberOf Card#
 * @returns {boolean}
 */
function isNewCard() {
  return !this.isInSchedule();
}

/**
 * @memberOf Card#
 */
function setSchedule(data) {
  deck.schedule[this.getId()] = {
    ...(deck.schedule[this.getId()] || {}),
    ...data,
  };
  saveScheduleForCardId(this.getId());
}
