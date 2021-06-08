import { url } from 'User/App/url'
import store from 'User/App/store'
import error from 'User/App/Error'
import axios from 'User/App/axios'
import Deck from './deck'
import { saveInLocalStorage, getFromLocalStorage } from 'User/App/functions/localStorage'
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
