import {CardInSession, IntervalRelativeToCurrentCardBeingAtZero,} from "flashcards/flashcards/actions/cardInSession";

/**
 * Used to control the next time a card should be shown in this session.
 * Only a single option (interval, minInterval, or cannotBeShownBeforeInterval)
 * is ever used at a time.
 * Used by {@link postponeRelatedCards} and {@link rate}.
 */
export function showIn(
  this: CardInSession,
  {
    interval,
    minInterval,
    cannotBeShownBeforeInterval,
  }: {
    /**
     * Sets the queue position of a card.
     * An interval of "1" means that this will be the next card.
     * A hard requirement (cannotBeShownBefore) will also be set automatically.
     */
    interval?: IntervalRelativeToCurrentCardBeingAtZero;
    /**
     * Set the minimum queue position of a card,
     * i.e. can move cards back but can never move cards forward.
     * A hard requirement (cannotBeShownBefore) will also be set automatically.
     */
    minInterval?: IntervalRelativeToCurrentCardBeingAtZero;
    /**
     * Hard requirement for when a card can be shown.
     * Rarely used since the above options automatically get a cannotBeShownBefore
     * set. Mainly used to set a low limit (e.g. 2) for a distantly related card.
     */
    cannotBeShownBeforeInterval?: IntervalRelativeToCurrentCardBeingAtZero;
  }
) {
  if (interval) {
    this.setQueuePosition(interval);
  }
  if (minInterval) {
    this.setQueuePosition(Math.max(this.getQueuePosition(), minInterval));
  }

  /**
   * Automatically set cannotBeShownBefore if either interval or minInterval is set.
   */
  if (!cannotBeShownBeforeInterval) {
    if ((interval || minInterval || 0) > 6) {
      cannotBeShownBeforeInterval = 6;
    } else {
      cannotBeShownBeforeInterval = 3;
    }
  }
  this.setCannotBeShownBefore(cannotBeShownBeforeInterval);

  // log(
  //   `${printWord(this.id)} – cannotBeShownBefore ${
  //     this.cannotBeShownBefore
  //   }, queue position: ${
  //     this.absoluteQueuePosition - this.session.counter
  //   }. Input: ${JSON.stringify({ interval, minInterval, cannotBeShownBefore })}`
  // );
}
