import {
  EACH_SESSION_LASTS_X_MINUTES,
  MAX_SECONDS_TO_COUNT_PER_ITEM,
} from "flashcards/flashcards/actions/session/session";
import {
  getTime,
  Milliseconds,
  minutes,
  seconds,
  Timestamp,
} from "modules/time";

export class SessionTimer {
  /** How long should a session last? */
  totalTime: Milliseconds;
  /**
   * Used to update the progress bar and to see when the time is up.
   * Is 0 if there is no time remaining.
   * Not updated unless updateRemainingTime() is
   * called (done in {@link Session.increaseCounter})
   */
  remainingTime: Milliseconds;
  #remainingTimeLastUpdatedAt: Timestamp;

  constructor() {
    this.totalTime = (EACH_SESSION_LASTS_X_MINUTES * minutes) as Milliseconds;
    this.remainingTime = this.totalTime;
    this.#remainingTimeLastUpdatedAt = getTime();
  }

  /**
   * Recalculates and then returns the remaining time.
   * Returns 0 if there is no time remaining.
   */
  updateRemainingTime() {
    const diff = Math.min(
      MAX_SECONDS_TO_COUNT_PER_ITEM * seconds,
      getTime() - (this.#remainingTimeLastUpdatedAt || 0)
    );
    /** Cannot be negative */
    this.remainingTime = Math.max(0, (this.remainingTime || 0) - diff);
    this.#remainingTimeLastUpdatedAt = getTime();
  }

  getSecondsSpent() {
    return Math.round(
      (this.totalTime - Math.max(0, this.remainingTime)) / 1000
    );
  }
}
