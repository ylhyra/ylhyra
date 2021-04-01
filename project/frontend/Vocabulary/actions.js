import store from 'App/store'
import cards_data from './TestData'
export const BAD = 1
export const OK = 2
export const PERFECT = 3

class Card {
  constructor(data) {
    this.data = data
  }
  get() {
    return this.data
  }
  isNew() {
    return true // temp
  }
  rate(rating) {
    this.rating = rating
  }
}

class Deck {
  constructor(cards) {
    this.currentId = null
    this.history = []
    this.counter = 0
    this.cards = {}
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    this.cards = cards.map(card => Card(card))

    // /* New cards must be studied in the correct order */
    // this.newCards = this.cards.filter(card => card.isNew())
    //
    // /* A maximum of 5 cards are under intensive study */
    // this.intensiveStudy = []
  }
  getCard() {
    return this.cards[this.counter]
  }
  // rateCard(rating) {
  //   this.currentCard.rate(rating)
  // }
  next() {
    this.counter++;
  }
}

const deck = new Deck(cards_data)


export const load = () => {
  store.dispatch({
    type: 'LOAD_CARD',
    content: {
      ...deck.getCard(),
      counter: deck.counter,
    }
  })
}

export const answer = (rating) => {
  deck.getCard().rate(rating)
  deck.next()
  load()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }
