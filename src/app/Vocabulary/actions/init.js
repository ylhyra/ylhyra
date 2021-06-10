import { url } from 'app/App/url'
import store from 'app/App/store'
import error from 'app/App/Error'
import axios from 'app/App/axios'
import Deck from './deck'
import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'
// /api/Vocabulary/_database.json

export const Initialize = async() => {
  let database = getFromLocalStorage('vocabulary-database')
  if (!database) {
    database = (await axios.get(`${url}/api/vocabulary/_database.json`)).data
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
