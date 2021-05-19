import { url } from 'App/url'
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import Deck from './deck'
import { saveInLocalStorage, getFromLocalStorage } from 'project/frontend/App/functions/localStorage'
import { day } from 'project/frontend/App/functions/time.js'
// /api/vocabulary/vocabulary_database.json

export const Initialize = async() => {
  let database = getFromLocalStorage('vocabulary-database')
  if (!database) {
    database = (await axios.get(`${url}/api/vocabulary/vocabulary_database.json`)).data
    saveInLocalStorage('vocabulary-database', database)
    saveInLocalStorage('vocabulary-database-last-updated', new Date().getTime())
  }

  let schedule = getFromLocalStorage('vocabulary-schedule')
  // let session = getFromLocalStorage('vocabulary-session')
  // if(getFromLocalStorage('vocabulary-session-saved-at') + day > new Date().getTime()){
  //   session = null
  // }
  const deck = new Deck(database, schedule)
  store.dispatch({
    type: 'LOAD_DECK',
    content: deck,
  })
}
