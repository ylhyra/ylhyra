/**
 * @module Card
 * An interval of "1" means that the card will be shown immediately
 */
export function showIn({ interval, minInterval, cannotBeShownBefore }) {
  if (interval) {
    this.absoluteQueuePosition = this.session.counter + interval;
  } else if (minInterval) {
    const newPos = this.session.counter + interval;
    if (newPos > this.absoluteQueuePosition) {
      this.absoluteQueuePosition = newPos;
    }
  }

  let c = cannotBeShownBefore || ((interval || minInterval) > 6 ? 6 : 3);
  if (interval) {
    c = Math.min(c, interval);
  }
  this.cannotBeShownBefore = Math.max(
    this.cannotBeShownBefore || 0,
    this.session.counter + c
  );

  // console.log(
  //   `${printWord(this.id)} – cannotBeShownBefore ${
  //     this.cannotBeShownBefore
  //   }, queue position: ${
  //     this.absoluteQueuePosition - this.session.counter
  //   }. Input: ${JSON.stringify({ interval, minInterval, cannotBeShownBefore })}`
  // );
}

/**
 * @module Card
 */
export function canBeShown() {
  return (
    !this.cannotBeShownBefore ||
    this.cannotBeShownBefore <= this.session.counter
  );
}
