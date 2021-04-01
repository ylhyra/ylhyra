import store from 'App/store'
import cards_data from './TestData'
export const BAD = 1
export const OK = 2
export const PERFECT = 3

// /*
//
// */
// class Card {
//   constructor(...data) {
//     this
//   }
// }

class Deck {
  constructor(cards_input) {
    this.currentId = null
    this.history = []
    this.counter = 0
    // let id_to_card = {}
    // cards_input.forEach(card => {
    //   id_to_card[card.id] = card
    // })
    this.cards = cards_input
  }
  getCard() {
    return this.cards[this.counter]
  }
  rateCard() {
    return this.cards[this.counter]
  }
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

export const answer = (input) => {
  deck.next()
  load()
}

// export const next = (input) => {
//   store.dispatch({
//     type: 'LOAD_CARD',
//     content: test_data[1]
//   })
// }
