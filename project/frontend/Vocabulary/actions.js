import store from 'App/store'
import cards_data from './TestData'

export const BAD = 1
export const OK = 2
export const PERFECT = 3


class Card {
  constructor(data, _deck) {
    Object.assign(this, data)
    this.rating = this.rating || OK
    this.ratingHistory = this.ratingHistory || []
    this.deck = _deck
  }
  get() {
    return this.data
  }
  isNew() {
    return true // temp
  }
  rate(rating) {
    this.rating = rating
    this.lastSeen = this.deck.counter
  }
  getRating() {
    // const ticksSinceSeen = this.deck.counter - this.lastSeen
    const ticksSinceSeen = this.deck.counter - this.deck.lastSeenBelongsTo[this.belongs_to]
    if (ticksSinceSeen < 4) {
      return 100;
    }
    if(this.done) {
      return 30
    }
    return this.rating
  }
  getStatus() {
    if (!this.lastSeen) return null;
    return BAD
  }
}

class Deck {
  constructor(cards) {
    this.currentCard = null
    this.history = []
    this.counter = 0
    this.cards = {}
    this.lastSeenBelongsTo = {}
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    const _deck = this
    this.cards = cards.map(card => new Card(card, _deck))
    this.next()
    // /* New cards must be studied in the correct order */
    // this.newCards = this.cards.filter(card => card.isNew())
    //
    // /* A maximum of 5 cards are under intensive study */
    // this.intensiveStudy = []
  }
  getCard() {
    return this.currentCard
  }
  rateCard(rating) {
    this.currentCard.rate(rating, this.counter)
  }
  next() {
    this.currentCard = this.cards.sort((a, b) => a.getRating() - b.getRating())[0]
    this.counter++;
    this.lastSeenBelongsTo[this.currentCard.belongs_to] = this.counter
    // console.log(this.currentCard)
    console.log(this.cards
      .sort((a, b) => a.getRating() - b.getRating())
      .map(i => `${i.getRating()}\t${i.from==='is'?i.is:i.en}`)
      .join('\n')
    )
  }
  getStatus() {
    return {
      bad: this.cards.filter(card => card.getStatus() === BAD).length,
      ok: this.cards.filter(card => card.getStatus() === OK).length,
      good: this.cards.filter(card => card.getStatus() === PERFECT).length,
      total: 30,
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
  deck.rateCard(rating)
  deck.next()
  load()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }
