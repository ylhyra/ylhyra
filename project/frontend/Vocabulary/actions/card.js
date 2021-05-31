import { average, clamp } from 'App/functions/math'

export const BAD = 1
export const OK = 2
export const PERFECT = 3

// export const CARD_STATUS_NEW = 'new'
// export const CARD_STATUS_LEARNING = 'learning'
// export const CARD_STATUS_LEARNED = 'learned'
// LEVEL_A1

class Card {
  constructor(data, index, session) {
    Object.assign(this, data)

    this.session = session
    this.progress = 0
    this.history = []
    this.goodRepetitions = 0
    this.absoluteQueuePosition = index
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

    /* Schedule */
    let interval;
    if (rating === BAD) {
      interval = 2
      this.done = false
      /* User is getting annoyed */
      if (this.history.length > 4 && average(this.history.slice(0, 4)) < 0.3) {
        interval = 30
      }
    } else if (rating === OK) {
      interval = 15
      this.done = true
      if (this.history[1] >= OK) {
        interval = 28
      } else if (this.history[1] === BAD) {
        this.done = false // Hmm ?
      }
    } else if (rating === PERFECT) {
      interval = this.session.cards.length + 100
      this.done = true
    }
    this.absoluteQueuePosition = this.session.counter + interval
    this.lastInterval = interval

    this.status = Math.round(lastTwoAverage)

    if (this.history.length >= 6) {
      this.done = true
    }

    /* Postpone related cards */
    const card = this
    this.terms.forEach(term => {
      this.session.cards.forEach(_card => {
        if (_card.id === card.id) return;
        if (_card.terms.includes(term)) {
          const newPosition = _card.session.counter + Math.min(interval, 10) //+ 1 /* Plus one since
          if (newPosition > _card.absoluteQueuePosition) {
            _card.absoluteQueuePosition = newPosition
          }
        }
      })
    })

    this.session.cardTypeLog.unshift(this.from)
  }
  getQueuePosition() {
    return this.absoluteQueuePosition - this.session.counter
  }
  ticksSinceTermWasSeen() {
    let last_seen = null;
    this.terms.forEach(term => {
      if (this.session.lastSeenTerms[term] && (last_seen === null || last_seen > this.session.lastSeenTerms[term])) {
        last_seen = this.session.lastSeenTerms[term]
      }
    })
    if (last_seen) {
      return this.session.counter - last_seen
    } else {
      return this.session.cards.length
    }
  }
  getRanking() {
    let q = this.getQueuePosition();

    // /* Slightly adjust so that when two cards compete, the one that hasn't been seen for a while wins. May not be necessary */
    // q += (this.session.cards.length - this.ticksSinceTermWasSeen()) / this.session.cards.length * 0.01

    /* New cards are not relevant unless there are no overdue cards */
    if (this.history.length === 0) {
      q = this.absoluteQueuePosition + 900
    }

    /* Seen cards */
    else {
      /* Seen cards are not relevant if they are not overdue */
      if (q > 0) {
        q += 1000
      }
    }

    /* A bad card that is due exactly now has priority */
    if (this.history[0] === BAD && q === 0) {
      q -= 50
    }

    if (this.ticksSinceTermWasSeen() < 2) {
      q += (5000 - this.ticksSinceTermWasSeen())
    }
    if (this.done) {
      q += 300
    }
    /* Prevent rows of the same card type from appearing right next to each other */
    if (this.session.cardTypeLog[0] === this.from) {
      q += 0.4
      if (this.session.cardTypeLog[1] === this.from) {
        q += 1.9
      }
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
