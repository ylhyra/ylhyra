/**
 * @memberOf CardInSession
 * All values are relative to the currently shown card, which is at 0.
 * @param {object} param
 * @param {number=} param.interval
 *   An interval of "1" means that the cardInSession will be shown immediately.
 *   Used to give a card a particular queue position.
 * @param {number=} param.minInterval
 *   Used to push a card back without pushing it to the front.
 * @param {number=} param.cannotBeShownBefore
 *   Adds hard requirements for when a card can be shown.
 */
export function showIn({ interval, minInterval, cannotBeShownBefore }) {
  /* Set queue position (soft requirements) */
  if (interval) {
    this.setQueuePosition(interval);
  }
  if (minInterval) {
    Math.max(this.getQueuePosition(), minInterval) |> this.setQueuePosition;
  }

  /* Can absolutely not be shown before X (strong requirements) */
  if (!cannotBeShownBefore) {
    if ((interval || minInterval) > 6) {
      cannotBeShownBefore = 6;
    } else {
      cannotBeShownBefore = 3;
    }
  }
  if (interval) {
    cannotBeShownBefore = Math.min(cannotBeShownBefore, interval);
  }
  this.setCannotBeShownBefore(cannotBeShownBefore);

  // log(
  //   `${printWord(this.id)} – cannotBeShownBefore ${
  //     this.cannotBeShownBefore
  //   }, queue position: ${
  //     this.absoluteQueuePosition - this.session.counter
  //   }. Input: ${JSON.stringify({ interval, minInterval, cannotBeShownBefore })}`
  // );
}

/**
 * @memberOf CardInSession
 * @returns {boolean}
 */
export function canBeShown() {
  return (
    !this.cannotBeShownBefore ||
    this.cannotBeShownBefore <= this.session.counter
  );
}
