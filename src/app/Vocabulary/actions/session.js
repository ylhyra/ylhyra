/**
 * A single study session.
 */
import store from 'app/App/store'
import _ from 'underscore'
import Card, { BAD, GOOD, EASY } from './card'
export const MINUTES = 5
export const MAX_SECONDS_TO_COUNT_PER_ITEM = 15
const LOGGING = false

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
    this.counter++;
    this.updateRemainingTime()
    if (this.cards.length === 0) {
      console.error('No cards')
      this.createMoreCards()
      /* Prevent infinite calls */
      if (depth === 0) {
        this.next(1)
      } else {
        throw new Error('Failed to generate cards')
        // TODO User-facing error?
      }
      return
    }

    let ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())
    this.currentCard = ranked[0]

    /* Logging */
    if ((LOGGING || window.logging) && process.env.NODE_ENV === 'development') {
      const deck = this.deck
      console.log(ranked
        .map(i => `${i.getQueuePosition()}\t${Math.round(i.getRanking())}\t${i.from==='is'?i.is:i.en}\t${deck.schedule[i.id] ? new Date(deck.schedule[i.id].last_seen) : ''}\t${i.history.length > 0 ? 'SEEN' : 'NEW'}`)
        .join('\n')
      )
    }

    /* Store when this term was last seen */
    this.currentCard.terms.forEach(id => {
      this.lastSeenTerms[id] = this.counter
    })

    this.deck.saveSession(this)
    this.checkIfCardsRemaining()
  }
}

/**
 * @extends Session
 */
export const updateRemainingTime = function () {
  const newTimestamp = (new Date()).getTime()
  const diff = Math.min(
    MAX_SECONDS_TO_COUNT_PER_ITEM * 1000,
    newTimestamp - this.lastTimestamp
  )
  this.remainingTime = Math.max(0, this.remainingTime - diff)
  this.lastTimestamp = newTimestamp
  if (this.remainingTime <= 0) {
    this.deck.sessionDone()
    this.done = true
  }
}

/**
 * @extends Session
 */
export const getAdjustedPercentageDone = function () {
  return ((this.totalTime - this.remainingTime) / this.totalTime) * 100
}

/**
 * @extends Session
 */
export const printTimeRemaining = function () {
  const time = Math.floor(this.remainingTime / 1000) || 1
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${('0'+seconds).slice(-2)}`
  // return `${minutes} minute${minutes===1?'':''}, ${('0'+seconds).slice(-2)} second${seconds===1?'s':''}`
}

/**
 * @extends Session
 */
export const getCard = function () {
  return this.currentCard
}

/**
 * @extends Session
 */
export const checkIfCardsRemaining = function () {
  const areThereNewCardsRemaining = this.cards.some(i => i.history.length === 0)
  if (!areThereNewCardsRemaining) {
    this.createMoreCards()
  }
}

/**
 * @extends Session
 */
export const createMoreCards = function () {
  const newCards = this.deck.createCards({
    forbidden_ids: this.cards.map(i => i.id)
  })
  this.cards = this.cards
    .concat(newCards.map((card, index) => new Card(card, index, this)))
  console.log('New cards generated')
}

/**
 * @extends Session
 */
export const getStatus = function () {
  return {
    bad: this.cards.filter(card => card.getStatus() === BAD).length,
    good: this.cards.filter(card => card.getStatus() === GOOD).length,
    easy: this.cards.filter(card => card.getStatus() === EASY).length,
    total: this.cards.length,
    wordsTotal: _.uniq(_.flatten(this.cards.map(i => i.terms))).length,
    counter: this.counter,
  }
}

Session.prototype.updateRemainingTime = updateRemainingTime
Session.prototype.getAdjustedPercentageDone = getAdjustedPercentageDone
Session.prototype.printTimeRemaining = printTimeRemaining
Session.prototype.getCard = getCard
Session.prototype.checkIfCardsRemaining = checkIfCardsRemaining
Session.prototype.createMoreCards = createMoreCards
Session.prototype.getStatus = getStatus

export const loadCard = () => {
  const session = store.getState().vocabulary.session
  if (!session || !session.currentCard) return console.error('no cards')
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
  if (!session.done) {
    loadCard()
  }
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
