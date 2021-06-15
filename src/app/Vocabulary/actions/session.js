/**
 * A single study session.
 */
import store from 'app/App/store'
import _ from 'underscore'
import Card, { BAD, GOOD, EASY } from './card'
// import { day } from 'app/App/functions/time.js'
export const MINUTES = 3
const MAX_SECONDS_TO_COUNT_PER_ITEM = 15
const LOGGING = true

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
    this.timeStarted = (new Date()).getTime()

    this.totalTime = MINUTES * 60 * 1000
    this.remainingTime = this.totalTime
    this.lastTimestamp = (new Date()).getTime()
    this.checkIfCardsRemaining()
  }
  next(depth = 0) {
    this.updateRemainingTime()
    if (this.cards.length === 0) {
      console.error('No cards')
      this.createMoreCards()
      /* Prevent infinite calls */
      if (depth === 0) {
        this.next(1)
      } else {
        throw new Error('Failed to generate cards')
        // TODO User-facing error
      }
      return
    }

    let ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())
    this.currentCard = ranked[0]

    /* Logging */
    if (LOGGING && process.env.NODE_ENV === 'development') {
      console.log(ranked
        .map(i => `${i.getQueuePosition()}\t${Math.round(i.getRanking())}\t${i.from==='is'?i.is:i.en}\t${this.history.length > 0 ? 'SEEN' : 'NEW'}`)
        .join('\n')
      )
    }

    this.counter++;

    /* Store when this term was last seen */
    this.currentCard.terms.forEach(id => {
      this.lastSeenTerms[id] = this.counter
    })

    this.deck.saveSession(this)
    this.checkIfCardsRemaining()
  }
}

Session.prototype.updateRemainingTime = function () {
  const newTimestamp = (new Date()).getTime()
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    newTimestamp - this.lastTimestamp
  )
  this.remainingTime = Math.max(0, this.remainingTime - diff)
  this.lastTimestamp = newTimestamp
  if (this.remainingTime <= 0) {
    this.deck.sessionDone()
  }
}
Session.prototype.getAdjustedPercentageDone = function () {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100
}
Session.prototype.printTimeRemaining = function () {
  const time = Math.floor(this.remainingTime / 1000) || 1
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${('0'+seconds).slice(-2)}`
  // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
}
Session.prototype.getCard = function () {
  return this.currentCard
}
Session.prototype.checkIfCardsRemaining = function () {
  const areThereNewCardsRemaining = this.cards.some(i => i.history.length === 0)
  if (!areThereNewCardsRemaining) {
    this.createMoreCards()
  }
}
Session.prototype.createMoreCards = function () {
  const newCards = this.deck.createCards({
    forbidden_ids: this.cards.map(i => i.id)
  })
  this.cards = this.cards.concat(newCards.map((card, index) => new Card(card, index, this)))
  console.log('New cards generated')
}
Session.prototype.getStatus = function () {
  return {
    bad: this.cards.filter(card => card.getStatus() === BAD).length,
    ok: this.cards.filter(card => card.getStatus() === GOOD).length,
    good: this.cards.filter(card => card.getStatus() === EASY).length,
    total: this.cards.length,
    wordsTotal: _.uniq(_.flatten(this.cards.map(i => i.terms))).length,
    counter: this.counter,
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
  if (!deck) throw new Error('Deck misssing')
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
