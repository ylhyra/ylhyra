
class Card {
  constructor(data, index) {
    Object.assign(this, data)

    /*  */
    this.progress = 0
    this.easiness = DEFAULT_E_FACTOR
    this.history = []
    this.goodRepetitions = 0
    this.queuePosition = index + counter
  }
  rate(rating) {
    this.history.unshift(rating)
    this.lastSeen = counter

    /* Score */
    const lastTwoAverage = average(this.history.slice(0, 2))
    this.score = Math.floor(lastTwoAverage)

    if (rating !== BAD) {
      this.goodRepetitions++
    }

    /* Derived from SuperMemo2 */
    const diff = 1.9 - rating
    this.easiness = Math.max(MIN_E_FACTOR, this.easiness + 0.1 - diff * (0.08 + diff * 0.02))

    /* Schedule */
    let interval;
    if (rating === BAD) {
      interval = 3
      this.done = false
      /* User is getting annoyed */
      if (this.history.length > 4 && average(this.history.slice(0, 4)) < 0.3) {
        interval = 30
      }
    } else if (rating === OK) {
      interval = 8
      if (this.history[1] >= OK) {
        interval = 28
        this.done = true
      } else if (this.history[1] === BAD) {
        interval = 4
      }
    } else if (rating === PERFECT) {
      interval = 16
      if (this.history[1] >= OK) {
        interval = deck.cards.length + 100
        this.done = true
      } else if (this.history.length === 1) {
        interval = deck.cards.length
      }
    }
    this.queuePosition = queueCounter + interval
    this.lastInterval = interval

    this.status = Math.round(lastTwoAverage)

    if (
      this.history.length >= 6 ||
      this.history.length >= 2 && lastTwoAverage >= OK ||
      lastTwoAverage === PERFECT) {
      this.done = true
    } else {
      this.done = false
    }
  }
  getQueuePosition() {
    return this.queuePosition - queueCounter
  }
  getLastSeen() {
    if (this.belongs_to.find(i=>lastSeenBelongsTo[i])) {
      return counter - this.belongs_to.find(i=>lastSeenBelongsTo[i])
    } else {
      return deck.cards.length
    }
  }
  getRanking() {
    let q = this.getQueuePosition() +
      this.easiness * 0.001 +
      (deck.cards.length - this.getLastSeen()) / deck.cards.length * 0.01
    if (this.getLastSeen() <= 3) {
      return q + deck.cards.length + 100;
    }
    if (this.done) {
      return q + deck.cards.length + 30
    }
    return q
  }
  getStatus() {
    if (!this.lastSeen) return null;
    return this.status
  }
  shouldShowHint() {
    const lastTwoAverage = average(this.history.slice(0, 2))
    return !(
      this.history[0] === PERFECT ||
      this.history.length >= 2 && lastTwoAverage >= OK
    )
  }
}
