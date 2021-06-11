/**
 * The deck contains *all* terms
 */
import store from 'app/App/store'
import error from 'app/App/Error'
import axios from 'app/App/axios'
import { updateSchedule } from './scheduleAfterSession'
import { InitializeSession } from 'app/Vocabulary/actions/session'
import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'
import createCards from './createCards'
import { saveSchedule } from './sync'

import { updateURL } from 'app/Router/actions'

class Deck {
  constructor(database, schedule, session) {
    const deck = this
    const { cards, terms } = database
    this.cards = cards
    this.cards_sorted = Object.keys(cards).map(key => {
      // if(typeof cards[key] === 'function') return null;
      return {
        id: key,
        ...cards[key],
      }
    }).filter(Boolean).sort((a, b) => a.sort - b.sort)
    this.schedule = schedule || {}
    // if(session) {
    //
    // }else{
    this.generateSession()
    // }
    // this.sessionLog = []
    this.saveSession()

    /* TEMPORARY */
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 /* ESC */ ) {
          deck.sessionDone()
        }
      })
    }
  }
  generateSession() {
    InitializeSession(this.createCards(), this)
  }
  sessionDone() {
    updateURL('VOCABULARY')
    updateSchedule()
  }
  continueStudying() {
    updateURL('VOCABULARY_RUNNING')
    this.generateSession()
  }
  studyNewWords() {}
  repeatTodaysWords() {}
  saveSession() {
    // saveInLocalStorage('vocabulary-session', store.getState().vocabulary.session)
    // saveInLocalStorage('vocabulary-session-saved-at', new Date().getTime())
  }
}
Deck.prototype.createCards = createCards
Deck.prototype.saveSchedule = saveSchedule
export default Deck
