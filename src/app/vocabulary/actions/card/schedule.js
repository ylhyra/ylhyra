import { deck } from "app/vocabulary/actions/deck";
import { BAD, GOOD } from "app/vocabulary/actions/cardInSession";
import { INCR } from "app/vocabulary/actions/createSchedule";
import { saveScheduleForCardId } from "app/vocabulary/actions/sync";
import { minIgnoreFalsy } from "app/app/functions/math";

/**
 * @module Card
 */
export function getSchedule() {
  return deck.schedule[this.getId()];
}

/**
 * @module Card
 */
export function getDue() {
  return this.getSchedule()?.due;
}

/**
 * @module Card
 */
export function getScore() {
  return this.getSchedule()?.score;
}

/**
 * @module Card
 */
export function getSessionsSeen() {
  return this.getSchedule()?.sessions_seen;
}

/**
 * @module Card
 */
export function getLastIntervalInDays() {
  return this.getSchedule()?.last_interval_in_days;
}

/**
 * @module Card
 */
export function getLastSeen() {
  return this.getSchedule()?.last_seen;
}

/**
 * @module Card
 */
export function isBad() {
  return this.getScore() === BAD;
}

/**
 * @module Card
 */
export function isFairlyBad() {
  return this.getScore() && this.getScore() <= BAD + INCR;
}

/**
 * @module Card
 */
export function isBelowGood() {
  return this.getScore() && this.getScore() < GOOD;
}

/**
 * @module Card
 */
export function isUnseenOrNotGood() {
  return !this.getScore() || this.getScore() < GOOD;
}

/**
 * @module Card
 */
export function isTermUnknownOrNotGood() {
  const lowest = this.getLowestAvailableTermScore();
  return !lowest || lowest < GOOD;
}

/**
 * @module Card
 */
export function getLowestAvailableTermScore() {
  let lowest = null;
  this.getAllCardsWithSameTerm().forEach((card) => {
    if (card.getScore()) {
      lowest = minIgnoreFalsy(lowest, card.getScore());
    }
  });
  return lowest;
}

/**
 * @module Card
 */
export function getTermLastSeen() {
  return Math.max(
    ...this.getAllCardsWithSameTerm()
      .map((card) => card.getLastSeen())
      .filter(Boolean)
  );
}

/**
 * @module Card
 */
export function isInSchedule() {
  return this.getId() in deck.schedule;
}

/**
 * @module Card
 */
export function isNewCard() {
  return !this.isInSchedule();
}

/**
 * @module Card
 */
export function setSchedule(data) {
  deck.schedule[this.getId()] = {
    ...(deck.schedule[this.getId()] || {}),
    ...data,
  };
  saveScheduleForCardId(this.getId());
}
