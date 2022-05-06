import {
  CardInSession,
  IntervalRelativeToCurrentCardBeingAtZero,
} from "flashcards/flashcards/actions/cardInSession";

type ShowInOptions = {
  /**
   * An interval of "1" means that the cardInSession will be shown immediately.
   * Used to give a card a particular queue position.
   */
  interval?: IntervalRelativeToCurrentCardBeingAtZero;
  /** Used to push a card back without pushing it to the front */
  minInterval?: IntervalRelativeToCurrentCardBeingAtZero;
  /** Adds hard requirements for when a card can be shown.*/
  cannotBeShownBeforeInterval?: IntervalRelativeToCurrentCardBeingAtZero;
};

/**
 * Used to control the next time a card should be shown in this session.
 * Used by {@link postponeRelatedCards} and {@link rate}.
 */
export function showIn(
  this: CardInSession,
  { interval, minInterval, cannotBeShownBeforeInterval }: ShowInOptions
) {
  /* Set queue position (soft requirements) */
  if (interval) {
    this.setQueuePosition(interval);
  }
  if (minInterval) {
    this.setQueuePosition(Math.max(this.getQueuePosition(), minInterval));
  }

  /* Can absolutely not be shown before X (strong requirements) */
  if (!cannotBeShownBeforeInterval) {
    if ((interval || minInterval || 0) > 6) {
      cannotBeShownBeforeInterval = 6;
    } else {
      cannotBeShownBeforeInterval = 3;
    }
  }
  if (interval) {
    cannotBeShownBeforeInterval = Math.min(
      cannotBeShownBeforeInterval,
      interval
    );
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
