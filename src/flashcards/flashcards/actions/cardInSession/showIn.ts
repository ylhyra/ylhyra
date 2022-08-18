import {
  CardInSession,
  IntervalRelativeToCurrentCardBeingAtZero,
} from "flashcards/flashcards/actions/cardInSession";

/**
 * Used to control the next time a card should be shown in this session. Only a
 * single option (interval, minInterval, or cannotBeShownUntilInterval) is ever
 * used at a time. Used by {@link postponeRelatedCards} and {@link rate}.
 */
export function showIn(
  this: CardInSession,
  {
    interval,
    minInterval,
    cannotBeShownUntilInterval,
  }: {
    /**
     * Sets the queue position of a card. An interval of "1" means that this
     * will be the next card. A hard requirement (cannotBeShownUntil) will also
     * be set automatically.
     */
    interval?: IntervalRelativeToCurrentCardBeingAtZero;
    /**
     * Set the minimum queue position of a card, i.e. can move cards back but
     * can never move cards forward. A hard requirement (cannotBeShownUntil)
     * will also be set automatically.
     */
    minInterval?: IntervalRelativeToCurrentCardBeingAtZero;
    /**
     * Hard requirement for when a card can be shown. Rarely used since the
     * above options automatically get a cannotBeShownUntil set. Mainly used to
     * set a low limit (e.g. 2) for a distantly related card but also to force
     * cards that depend on a bad on come later.
     */
    cannotBeShownUntilInterval?: IntervalRelativeToCurrentCardBeingAtZero;
  },
) {
  if (interval) {
    this.queuePosition = interval;
  }
  if (minInterval) {
    this.queuePosition = Math.max(this.queuePosition, minInterval);
  }

  /** Automatically set cannotBeShownUntil if either interval or minInterval is set. */
  if (!cannotBeShownUntilInterval) {
    if ((interval || minInterval || 0) > 6) {
      cannotBeShownUntilInterval = 6;
    } else {
      cannotBeShownUntilInterval = Math.min(interval || minInterval || 0, 3);
    }
  }
  this.cannotBeShownUntil = cannotBeShownUntilInterval;

  // log(
  //   `${printWord(this.id)} – cannotBeShownUntil ${
  //     this.cannotBeShownUntil
  //   }, queue position: ${
  //     this.absoluteQueuePosition - this.session.counter
  //   }. Input: ${JSON.stringify({ interval, minInterval, cannotBeShownUntil })}`
  // );
}
