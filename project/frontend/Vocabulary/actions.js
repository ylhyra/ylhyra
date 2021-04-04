import store from 'App/store'
import cards_data from './TestData'

export const BAD = 0.1
export const OK = 0.5
export const PERFECT = 1

let counter = 0
let queueCounter = 0
let lastSeenBelongsTo = {}
let currentCard = null

class Card {
  constructor(data, index) {
    Object.assign(this, data)

    /*  */
    this.progress = 0
    this.easiness = 0
    this.history = []
    this.goodRepetitions = 0
    this.queuePosition = index + counter
  }
  rate(rating) {
    this.history.unshift(rating)
    this.lastSeen = counter

    /* Score */
    const lastTwoAverage = average(this.history.slice(0, 2))

    /* Derived from SuperMemo2 */
    this.easiness = this.easiness + 0.1 - (PERFECT - rating) * (0.08 + (PERFECT - rating) * 0.02)

    /* Schedule */
    let interval;
    if (rating === BAD) {
      interval = 3
      this.done = false
      /* User is getting annoyed */
      if (this.history.length > 4 && average(this.history.slice(0, 4) < 0.3)) {
        interval = 10
      }
    } else if (rating === OK) {
      interval = 8
      if (this.history[1] >= OK) {
        interval = 28
        this.done = true
      }
    } else if (rating === PERFECT) {
      interval = 16
      if (this.history[1] >= OK) {
        interval = 100
        this.done = true
      }
    }
    if (rating !== BAD) {
      this.goodRepetitions++
    }
    this.queuePosition = queueCounter + interval
    this.lastInterval = interval
    // if(this.history.slice(0, 2))
    //
    // if(this.history.slice(0,5).some(i=>i===BAD)
  }
  getQueuePosition() {
    return this.queuePosition - queueCounter
  }
  getRanking() {
    let q = this.getQueuePosition() + this.easiness
    const ticksSinceSeen = counter - lastSeenBelongsTo[this.belongs_to]
    if (ticksSinceSeen <= 3) {
      return q + 100;
    }
    if (this.done) {
      return q + 30
    }
    return q
  }
  getStatus() {
    if (!this.lastSeen) return null;
    return this.status
  }
}

class Deck {
  constructor(cards) {
    this.history = []
    this.cards = {}
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    this.cards = cards.map((card, index) => new Card(card, index))
    this.next()
    // /* New cards must be studied in the correct order */
    // this.newCards = this.cards.filter(card => card.isNew())
    //
    // /* A maximum of 5 cards are under intensive study */
    // this.intensiveStudy = []
  }
  getCard() {
    return currentCard
  }
  next() {
    const ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())
    console.log(this.cards.slice().sort((a, b) => a.getQueuePosition() - b.getQueuePosition())
      .map(i => `${i.getQueuePosition()}\t${i.getRanking()}\te: ${i.easiness||0}\t${i.from==='is'?i.is:i.en}`)
      .join('\n')
    )
    // console.log(this.cards.sort((a, b) => a.getRanking() - b.getRanking())
    //   .map(i => `${i.getQueuePosition()}\t${i.getRanking()}\t${i.from==='is'?i.is:i.en}`)
    //   .join('\n')
    // )
    // console.log(ranked.slice(0,4))
    currentCard = ranked[0]
    counter++;
    let shouldIncreaseAdjustedCounter = this.cards.filter(i => i.getQueuePosition() < 5).length < 5
    // console.log({ shouldIncreaseAdjustedCounter })
    if (shouldIncreaseAdjustedCounter) {
      queueCounter++;
    }
    lastSeenBelongsTo[currentCard.belongs_to] = counter
    // console.log(currentCard)
  }
  getStatus() {
    return {
      bad: this.cards.filter(card => card.getStatus() === BAD).length,
      ok: this.cards.filter(card => card.getStatus() === OK).length,
      good: this.cards.filter(card => card.getStatus() === PERFECT).length,
      total: this.cards.filter(card => card.done).length,
    }
  }
}

const deck = new Deck(cards_data)


export const load = () => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: {
      ...deck.getCard(),
      counter: deck.counter,
      status: deck.getStatus(),
    }
  })
}

export const answer = (rating) => {
  currentCard.rate(rating)
  deck.next()
  load()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }


const average = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
