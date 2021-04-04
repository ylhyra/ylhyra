import store from 'App/store'
import cards_data from './TestData'

export const BAD = 1
export const OK = 2
export const PERFECT = 3

let counter = 0
let queueCounter = 0
let lastSeenBelongsTo = {}
let currentCard = null

class Card {
  constructor(data, index) {
    Object.assign(this, data)
    this.score = null
    this.ratingHistoryForSession = []
    this.queuePosition = index + counter
  }
  rate(rating) {
    this.ratingHistoryForSession.unshift(rating)
    this.lastSeen = counter

    /* Score */
    this.score = average(this.ratingHistoryForSession.slice(0, 2))

    /* Schedule */
    let next;
    if (rating === BAD) {
      next = 3
    } else if (rating === OK) {
      next = 8
    } else if (rating === PERFECT) {
      next = 16
    }
    this.queuePosition = queueCounter + next
    // if(this.ratingHistoryForSession.slice(0, 2))
    //
    // if(this.ratingHistoryForSession.slice(0,5).some(i=>i===BAD)
  }
  getRawRanking() {
    return this.queuePosition - queueCounter
  }
  getRanking() {
    let ranking = this.getRawRanking()
    const ticksSinceSeen = counter - lastSeenBelongsTo[this.belongs_to]
    if (ticksSinceSeen <= 3) {
      return ranking + 100;
    }
    if (this.done) {
      return ranking + 30
    }
    return ranking
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
    console.log(this.cards.slice().sort((a, b) => a.getRawRanking() - b.getRawRanking())
      .map(i => `${i.getRawRanking()}\t${i.getRanking()}\t${i.score||0}\t${i.from==='is'?i.is:i.en}`)
      .join('\n')
    )
    // console.log(this.cards.sort((a, b) => a.getRanking() - b.getRanking())
    //   .map(i => `${i.getRawRanking()}\t${i.getRanking()}\t${i.from==='is'?i.is:i.en}`)
    //   .join('\n')
    // )
    // console.log(ranked.slice(0,4))
    currentCard = ranked[0]
    counter++;
    let shouldIncreaseAdjustedCounter = this.cards.filter(i => i.getRawRanking() < 5).length < 5
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
