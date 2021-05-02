import { average, clamp } from 'App/functions/math'

export const BAD = 1
export const OK = 2
export const PERFECT = 3

// export const CARD_STATUS_NEW = 'new'
// export const CARD_STATUS_LEARNING = 'learning'
// export const CARD_STATUS_LEARNED = 'learned'
// LEVEL_A1

const MIN_E_FACTOR = 1.2
const DEFAULT_E_FACTOR = 2.5

class Card {
  constructor(data, index, session) {
    Object.assign(this, data)

    this.session = session
    this.progress = 0
    this.easiness = DEFAULT_E_FACTOR
    this.history = []
    this.goodRepetitions = 0
    this.queuePosition = index + this.session.counter
  }
  rate(rating) {
    this.history.unshift(rating)
    this.lastSeen = this.session.counter

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
        interval = this.session.cards.length + 100
        this.done = true
      } else if (this.history.length === 1) {
        interval = this.session.cards.length
      }
    }
    this.queuePosition = this.session.queueCounter + interval
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
    return this.queuePosition - this.session.queueCounter
  }
  getLastSeen() {
    let last_seen = null;
    this.word_ids.forEach(i => {
      if (this.session.lastSeenWordIds[i] && (last_seen === null || last_seen > this.session.lastSeenWordIds[i])) {
        last_seen = this.session.lastSeenWordIds[i]
      }
    })
    if (last_seen) {
      return this.session.counter - last_seen
    } else {
      return this.session.cards.length
    }
  }
  getRanking() {
    let q = this.getQueuePosition() +
      this.easiness * 0.001 +
      (this.session.cards.length - this.getLastSeen()) / this.session.cards.length * 0.01
    if (this.getLastSeen() <= 3) {
      return q + this.session.cards.length + 100;
    }
    if (this.done) {
      return q + this.session.cards.length + 30
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

export default Card
