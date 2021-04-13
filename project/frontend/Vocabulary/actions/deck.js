import store from 'App/store'
import _ from 'underscore'
import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

export const BAD = 1
export const OK = 2
export const PERFECT = 3

const MIN_E_FACTOR = 1.2
const DEFAULT_E_FACTOR = 2.5

let deck;
let counter = 0
let queueCounter = 0
let lastSeenBelongsTo = {}
let currentCard = null

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
    if (lastSeenBelongsTo[this.belongs_to]) {
      return counter - lastSeenBelongsTo[this.belongs_to]
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

class Deck {
  constructor(cards) {
    this.history = []
    this.cards = {}
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    this.cards = cards.map((card, index) => new Card(card, index))
    // /* New cards must be studied in the correct order */
    // this.newCards = this.cards.filter(card => card.isNew())
    //
    // /* A maximum of 5 cards are under intensive study */
    // this.intensiveStudy = []
  }
  getCard() {
    return {
      ...currentCard,
      showHint: currentCard.shouldShowHint()
    }
  }
  next() {
    if(this.cards.length === 0) {
      return console.error('No cards')
    }
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
      total: this.cards.length,
      cardsDone: this.cards.filter(card => card.done).length,
      wordsTotal: _.uniq(this.cards.map(i => i.belongs_to)).length,
      wordsDone: _.uniq(this.cards.filter(card => card.done).map(i => i.belongs_to)).length,
      deckDone: (this.cards.length - this.cards.filter(card => card.done).length) === 0,
      // total: this.cards.filter(card => card.done).length,
    }
  }
}

export const loadCard = () => {
  if(!currentCard) return console.error('no cards')
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
  loadCard()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }


const average = (arr = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

const clamp = function(input, min, max) {
  return Math.min(Math.max(input, min), max);
}


export const loadDeck = async (input) => {
  if(!input) {
    const { data } = await axios.get(`${url}/api/vocabulary`)
    input = input || data
  }
  console.log(input)
  if (Array.isArray(input)) {
    deck = new Deck(input)
    deck.next()
    loadCard()
  } else {
    // TODO!!
    // ERROR
  }
}
