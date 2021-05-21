/**
 * The deck contains *all* terms
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { generateNewSchedule } from './scheduling'
import { InitializeSession } from 'Vocabulary/actions/session'
import { url } from 'App/url'
import _ from 'underscore'
import { setScreen, SCREEN_DONE, SCREEN_VOCABULARY } from 'Vocabulary/Elements/Screens'
import { saveInLocalStorage, getFromLocalStorage } from 'project/frontend/App/functions/localStorage'
const DEFAULT_TERMS_PER_SESSION = 10
const MAX_NEW_CARDS_PER_SESSION = 10

class Deck {
  constructor(database, schedule, session) {
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
    const ref = this
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 27 /* ESC */ ) {
          ref.sessionDone()
        }
      })
    }
  }
  generateSession() {
    const now = (new Date()).getTime()

    /* Previously seen cards */
    let bad_cards_ids = []
    let good_overdue_ids = []
    let not_overdue_ids = []
    let scheduled = Object.keys(this.schedule).map(id => ({ id, ...this.schedule[id] }))
      .sort((a, b) => a.due - b.due)
      .forEach(i => {
        if (i.score <= 1.2) {
          bad_cards_ids.push(i.id)
        } else if (i.due < now) {
          good_overdue_ids.push(i.id)
        } else {
          // not_overdue_ids.push(i.id)
        }
      })
    let chosen_ids = _.shuffle([
      ...bad_cards_ids.slice(0, 8),
      ...good_overdue_ids.slice(0, 14),
      ...not_overdue_ids.slice(0, 14),
    ].slice(0, 11))

    /* New cards */
    let new_card_ids = [];
    for (let i = 0; i < this.cards_sorted.length; i++) {
      const id = this.cards_sorted[i].id
      // console.log(id)
      if (
        chosen_ids.length + new_card_ids.length < 15 &&
        new_card_ids.length < MAX_NEW_CARDS_PER_SESSION
      ) {
        if (!(id in this.schedule)) {
          new_card_ids.push(id)
        }
      } else {
        break;
      }
    }

    /* Interleave new cards with old cards */
    const ratio = chosen_ids.length / new_card_ids.length
    new_card_ids.forEach((id, index) => {
      /* Inserts item at correct ratio to spread new and old cards out. */
      chosen_ids.splice(
        Math.round(ratio * index) +
        index + /* To make up for the cards we've already added */
        1, /* Plus one to make old cards show up first */
        0, id
      )
    })

    /* Related cards */
    // chosen


    /* Depends on cards */
    // TODO
    //
    let chosen = chosen_ids.map(id => ({ id, ...this.cards[id] }))
    // console.log(chosen_ids)
    InitializeSession(chosen)
  }
  sessionDone() {
    setScreen(SCREEN_DONE)
    generateNewSchedule()
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
  saveSchedule() {
    /* Save schedule */
    saveInLocalStorage('vocabulary-schedule', this.schedule)

    // await axios.post(`${url}/api/vocabulary/save`, {
    //   data: getNewSchedule(),
    // })
  }
}
export default Deck
