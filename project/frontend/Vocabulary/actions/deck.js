/**
 * The deck contains *all* terms
 */
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { InitializeSession } from 'Vocabulary/actions/session'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import _ from 'underscore'
import { setScreen, SCREEN_DONE, SCREEN_VOCABULARY } from 'Vocabulary/Elements/Screens'
const CARDS_PER_SESSION = 1
const MAX_NEW_CARDS_PER_SESSION = 3

class Deck {
  constructor(cards) {
    this.cards = cards
    this.generateSession()
    this.schedule = {}
  }
  generateSession() {
    InitializeSession(
      _.shuffle(this.cards).slice(0, CARDS_PER_SESSION)
    )
  }
  sessionDone() {
    setScreen(SCREEN_DONE)
  }
  continueStudying() {
    this.generateSession()
    setScreen(SCREEN_VOCABULARY)
  }
  studyNewWords() {}
  repeatTodaysWords() {}
  sync() {
    // await axios.post(`${url}/api/vocabulary/save`, {
    //   data: getNewSchedule(),
    // })
  }
}

export const InitializeDeck = async () => {
  let cards = (await axios.post(`${url}/api/vocabulary/get`, /*null, { withCredentials: true }*/ )).data
  cards = (cards.map(
    ({ data, ...other }) => ({ ...other, ...JSON.parse(data) })
  ))
  const deck = new Deck(cards)
  store.dispatch({
    type: 'LOAD_DECK',
    content: deck,
  })
}
