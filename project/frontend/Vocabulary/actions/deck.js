/**
 * The deck contains *all* terms
 */
import store from 'App/store'

class Deck {
  constructor(cards) {
    this.terms = {}
    this.cards = {}
  }
}

export const InitializeDeck = (input) => {
  if (Array.isArray(input)) {
    const session = new Deck(input)
    // store.dispatch({
    //   type: 'LOAD_DECK',
    //   content: session,
    // })
  } else {
    // ERROR
  }
}
