/**
 * The deck contains *all* terms
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { updateSchedule } from './scheduleAfterSession'
import { InitializeSession } from 'Vocabulary/actions/session'
import { url } from 'App/url'
import { setScreen, SCREEN_DONE, SCREEN_VOCABULARY } from 'Vocabulary/Elements/Screens'
import { saveInLocalStorage, getFromLocalStorage } from 'project/frontend/App/functions/localStorage'
import createCards from './createCards'
import { saveSchedule } from './sync'

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
    setScreen(SCREEN_DONE)
    updateSchedule()
  }
  continueStudying() {
    this.generateSession()
    setScreen(SCREEN_VOCABULARY)
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
