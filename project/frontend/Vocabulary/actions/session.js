/**
 * A single study session.
 *
 *
 */
import store from 'App/store'
import _ from 'underscore'
import Card, { BAD, OK, PERFECT } from './card'
import { setScreen, SCREEN_VOCABULARY } from 'Vocabulary/Elements/Screens'
const MINUTES = 5

class Session {
  constructor(cards) {
    this.history = []
    this.cards = {}
    this.counter = 0
    this.queueCounter = 0
    this.lastSeenWordIds = {}
    this.currentCard = null
    this.cards = cards.map((card, index) => new Card(card, index, this))
  }
  getCard() {
    return {
      ...this.currentCard,
      // showHint: this.currentCard.shouldShowHint()
    }
  }
  next() {
    if (this.cards.length === 0) {
      return console.error('No cards')
    }
    const ranked = this.cards.slice().sort((a, b) => a.getRanking() - b.getRanking())

    this.currentCard = ranked[0]
    this.counter++;
    let shouldIncreaseAdjustedCounter = this.cards.filter(i => i.getQueuePosition() < 5).length < 5
    if (shouldIncreaseAdjustedCounter) {
      this.queueCounter++;
    }
    this.currentCard.terms.forEach(id => {
      this.lastSeenWordIds[id] = this.counter
    })

    /* Done */
    const isDone = (this.cards.length - this.cards.filter(card => card.done).length) === 0
    if (isDone) {
      this.done = true
      store.getState().vocabulary.deck.sessionDone()
    }
  }
  getStatus() {
    return {
      bad: this.cards.filter(card => card.getStatus() === BAD).length,
      ok: this.cards.filter(card => card.getStatus() === OK).length,
      good: this.cards.filter(card => card.getStatus() === PERFECT).length,
      total: this.cards.length,
      cardsDone: this.cards.filter(card => card.done).length,
      wordsTotal: _.uniq(_.flatten(this.cards.map(i => i.terms))).length,
      wordsDone: _.uniq(_.flatten(this.cards.filter(card => card.done).map(i => i.terms))).length,
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

export const InitializeSession = (input) => {
  if (Array.isArray(input)) {
    const session = new Session(input)
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


// console.log(this.cards.slice().sort((a, b) => a.getQueuePosition() - b.getQueuePosition())
//   .map(i => `${i.getQueuePosition()}\t${i.getRanking()}\te: ${i.easiness||0}\t${i.from==='is'?i.is:i.en}`)
//   .join('\n')
// )
