/**
 * The deck contains *all* terms
 */
import store from 'app/App/store'
import error from 'app/App/Error'
import axios from 'app/App/axios'
import { updateSchedule } from './createSchedule'
import { InitializeSession } from 'app/Vocabulary/actions/session'
import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'
import createCards from './createCards'
import { syncSchedule } from './sync'
import { updateURL } from 'app/Router/actions'
import { BAD, GOOD, EASY } from './card'

class Deck {
  constructor(database, schedule, session) {
    const deck = this
    const { cards, terms } = database
    this.cards = cards
    this.terms = terms
    this.cards_sorted = Object.keys(cards).map(key => {
      // if(typeof cards[key] === 'function') return null;
      return cards[key]
    }).filter(Boolean).sort((a, b) => a.sort - b.sort)
    this.schedule = schedule || {}

    /* TEMPORARY */
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 /* ESC */ ) {
          deck.sessionDone()
        }
      })
    }
    this.loadSessionFromLocalStorage()
  }
  generateSession() {
    InitializeSession(this.createCards(), this)
  }
  sessionDone() {
    updateSchedule()
    this.saveSession(null, true)
    updateURL(window.location.pathname)
    // store.dispatch({
    //   type: 'LOAD_SESSION',
    //   content: null,
    // })
  }
  continueStudying() {
    updateURL('VOCABULARY_PLAY')
    this.generateSession()
  }
  saveSession(session, done) {
    if (!done) {
      let to_save = session.cards.map(({ session, ...rest }) => rest)
      if (!to_save.some(i => i.history.length > 0)) {
        to_save = null
      }
      saveInLocalStorage('vocabulary-session', to_save)
      saveInLocalStorage('vocabulary-session-saved-at', new Date().getTime())
    } else {
      saveInLocalStorage('vocabulary-session', null)
    }
  }
  loadSessionFromLocalStorage() {
    /* TODO: Clear after a day */
    if (getFromLocalStorage('vocabulary-session')) {
      InitializeSession(getFromLocalStorage('vocabulary-session'), this)
    }
  }
}
Deck.prototype.createCards = createCards
Deck.prototype.syncSchedule = syncSchedule
export default Deck
