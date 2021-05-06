/**
 * The deck contains *all* terms
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { generateNewSchedule } from './scheduling'
import { InitializeSession } from 'Vocabulary/actions/session'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import _ from 'underscore'
import { setScreen, SCREEN_DONE, SCREEN_VOCABULARY } from 'Vocabulary/Elements/Screens'
const DEFAULT_TERMS_PER_SESSION = 10
const MAX_NEW_CARDS_PER_SESSION = 6

class Deck {
  constructor(cards, schedule) {
    this.cards = cards
    this.schedule = schedule || {}
    // this.sessionLog = []
    this.generateSession()
    this.save()
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
          not_overdue_ids.push(i.id)
        }
      })
    let chosen = _.shuffle([
      ...bad_cards_ids.slice(0, 8),
      ...good_overdue_ids.slice(0, 14),
      ...not_overdue_ids.slice(0, 14),
    ].slice(0, 11))

    /* New cards */
    let total_new_cards = 0;
    for (let i = 0; i < this.cards.length; i++) {
      if (chosen.length < 12 && total_new_cards < MAX_NEW_CARDS_PER_SESSION) {
        if (!(this.cards[i].id in this.schedule)) {
          /* TODO: Intersperse */
          chosen.push(this.cards[i].id)
          total_new_cards++;
        }
      } else {
        break;
      }
    }

    /* Intersperse */

    InitializeSession(
      _.shuffle(this.cards).slice(0)
    )
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
  save() {}
  sync() {
    localStorage.setItem('vocabulary-schedule', JSON.stringify(this.schedule))

    // await axios.post(`${url}/api/vocabulary/save`, {
    //   data: getNewSchedule(),
    // })
  }
}

export const InitializeDeck = async() => {
  let cards, schedule;
  if (localStorage.getItem('vocabulary-cards')) {
    cards = JSON.parse(localStorage.getItem('vocabulary-cards'))
  } else {
    cards = (await axios.post(`${url}/api/vocabulary/get`, /*null, { withCredentials: true }*/ )).data
    cards = (cards.map(
      ({ data, ...other }) => ({ ...other, ...JSON.parse(data) })
    ))
    localStorage.setItem('vocabulary-cards', JSON.stringify(cards))
  }

  if (localStorage.getItem('vocabulary-schedule')) {
    schedule = JSON.parse(localStorage.getItem('vocabulary-schedule'))
  }

  const deck = new Deck(cards, schedule)
  store.dispatch({
    type: 'LOAD_DECK',
    content: deck,
  })
}
