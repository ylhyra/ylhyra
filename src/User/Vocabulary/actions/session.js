/**
 * A single study session.
 *
 *
 */
import store from 'User/App/store'
import _ from 'underscore'
import Card, { BAD, OK, PERFECT } from './card'
// import { day } from 'User/App/functions/time.js'
export const MINUTES = 3
const MAX_SECONDS_TO_COUNT_PER_ITEM = 15

class Session {
  constructor(cards, deck) {
    this.history = []
    this.cards = {}
    this.counter = 0
    this.lastSeenTerms = {}
    this.cardTypeLog = []
    this.currentCard = null
    this.cards = cards.map((card, index) => new Card(card, index, this))
    this.deck = deck

    this.totalTime = MINUTES * 60 * 1000
    this.remainingTime = this.totalTime
    this.lastTimestamp = (new Date()).getTime()
  }
  updateRemainingTime() {
    const newTimestamp = (new Date()).getTime()
    const diff = Math.min(
      MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
      newTimestamp - this.lastTimestamp
    )
    this.remainingTime -= Math.max(0, diff)
    this.lastTimestamp = newTimestamp
    // console.log(this.remainingTime)
    if (this.remainingTime <= 0) {
      this.deck.sessionDone()
    }
  }
  getCard() {
    return {
      ...this.currentCard,
      // showHint: this.currentCard.shouldShowHint()
    }
  }
  next() {
    this.updateRemainingTime()
    if (this.cards.length === 0) {
      return console.error('No cards')
    }

    let ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())
    this.currentCard = ranked[0]

    // /* Logging */
    // if (process.env.NODE_ENV === 'development') {
    //   console.log(ranked
    //     .map(i => `${i.getQueuePosition()}\t${Math.round(i.getRanking())}\t${i.from==='is'?i.is:i.en}\t${this.history.length > 0 ? 'SEEN' : 'NEW'}`)
    //     .join('\n')
    //   )
    // }

    this.counter++;

    /* Store when this term was last seen */
    this.currentCard.terms.forEach(id => {
      this.lastSeenTerms[id] = this.counter
    })

    const areThereNewCardsRemaining = this.cards.some(i => i.history.length === 0)
    if (!areThereNewCardsRemaining) {
      this.createMoreCards()
    }
  }
  createMoreCards() {
    const newCards = this.deck.createCards({
      forbidden_ids: this.cards.map(i => i.id)
    })
    this.cards = this.cards.concat(newCards.map((card, index) => new Card(card, index, this)))
    console.log('New cards generated')
  }
  getStatus() {
    return {
      bad: this.cards.filter(card => card.getStatus() === BAD).length,
      ok: this.cards.filter(card => card.getStatus() === OK).length,
      good: this.cards.filter(card => card.getStatus() === PERFECT).length,
      total: this.cards.length,
      // cardsDone: this.cards.filter(card => card.done).length,
      wordsTotal: _.uniq(_.flatten(this.cards.map(i => i.terms))).length,
      // wordsDone: _.uniq(_.flatten(this.cards.filter(card => card.done).map(i => i.terms))).length,
      counter: this.counter,
      // sessionDone: this.done,
      // total: this.cards.filter(card => card.done).length,
    }
  }
}

export const loadCard = () => {
  const session = store.getState().vocabulary.session
  // if (session.done) return;
  if (!session.currentCard) return console.error('no cards')
  store.dispatch({
    type: 'LOAD_CARD',
    content: {
      ...session.getCard(),
      counter: session.counter,
      status: session.getStatus(),
    }
  })
}

export const answer = (rating) => {
  const session = store.getState().vocabulary.session
  session.currentCard.rate(rating)
  session.next()
  loadCard()
}

export const InitializeSession = (input, deck) => {
  if (Array.isArray(input)) {
    const session = new Session(input, deck)
    session.next()
    store.dispatch({
      type: 'LOAD_SESSION',
      content: session,
    })
    loadCard()
  } else {
    // ERROR
  }
}
