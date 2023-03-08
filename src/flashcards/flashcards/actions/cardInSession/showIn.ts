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
  }: {
    /**
     * Sets the queue position of a card. An interval of "1" means that this
     * will be the next card.
     */
    interval?: IntervalRelativeToCurrentCardBeingAtZero;
    /**
     * Set the minimum queue position of a card, i.e. can move cards back but
     * can never move cards forward.
     */
    minInterval?: IntervalRelativeToCurrentCardBeingAtZero;
  },
) {
  if (interval) {
    this.queuePosition = interval;
  }
  if (minInterval) {
    this.queuePosition = Math.max(this.queuePosition, minInterval);
    this.cannotBeShownUntil = minInterval;
  }
}
