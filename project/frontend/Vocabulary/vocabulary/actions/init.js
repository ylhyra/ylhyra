import { url } from 'App/url'
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import Deck from './deck'
import { saveInLocalStorage, getFromLocalStorage } from 'project/frontend/App/functions/localStorage'
// /api/Vocabulary/vocabulary/_database.json

export const Initialize = async() => {
  let database = getFromLocalStorage('vocabulary-database')
  if (!database) {
    database = (await axios.get(`${url}/api/Vocabulary/vocabulary/_database.json`)).data
    saveInLocalStorage('vocabulary-database', database)
    saveInLocalStorage('vocabulary-database-last-updated', new Date().getTime())
  }

  let schedule = getFromLocalStorage('vocabulary-schedule')
  const deck = new Deck(database, schedule)
  store.dispatch({
    type: 'LOAD_DECK',
    content: deck,
  })
  /* For testing */
  window.deck = deck
}
