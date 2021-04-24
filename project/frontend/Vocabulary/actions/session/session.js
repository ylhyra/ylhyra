/**
 * A single study session. 
 */
import store from 'App/store'
import _ from 'underscore'
import axios from 'axios'

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
    if (this.cards.length === 0) {
      return console.error('No cards')
    }
    const ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())
    // console.log(this.cards.slice().sort((a, b) => a.getQueuePosition() - b.getQueuePosition())
    //   .map(i => `${i.getQueuePosition()}\t${i.getRanking()}\te: ${i.easiness||0}\t${i.from==='is'?i.is:i.en}`)
    //   .join('\n')
    // )
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
  if (!currentCard) return console.error('no cards')
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

const average = (arr = []) => {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

const clamp = function (input, min, max) {
  return Math.min(Math.max(input, min), max);
}

export const loadDeck = (input) => {
  if (Array.isArray(input)) {
    deck = new Deck(input)
    deck.next()
    loadCard()
  } else {
    // TODO!!
    // ERROR
  }
}
