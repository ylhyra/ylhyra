import store from 'app/App/store'
import error from 'app/App/Error'
import axios from 'app/App/axios'
import Deck from './deck'
import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'
import { getUserFromCookie } from 'app/User/actions'

export const Initialize = async() => {
  let database = getFromLocalStorage('vocabulary-database')
  if (!database) {
    database = (await axios.get(`/api/vocabulary/vocabulary_database.json`)).data
    saveInLocalStorage('vocabulary-database', database)
    saveInLocalStorage('vocabulary-database-last-updated', new Date().getTime())
  }

  let schedule = getFromLocalStorage('vocabulary-schedule')
  if (!schedule) {
    schedule = {}
    if (getUserFromCookie()) {
      const r = (await axios.post(`/api/vocabulary/schedule`)).data
      r && r.forEach(i => {
        schedule[i.card_id] = i
      })
      // TODO
      // saveInLocalStorage('vocabulary-database', database)
      // saveInLocalStorage('vocabulary-database-last-updated', new Date().getTime())
    }
  }

  const deck = new Deck(database, schedule)
  store.dispatch({
    type: 'LOAD_DECK',
    content: deck,
  })
  /* For testing */
  window.deck = deck
}
