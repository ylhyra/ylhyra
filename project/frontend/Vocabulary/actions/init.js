import { url } from 'App/url'
import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import Deck from './deck'
// /api/vocabulary/vocabulary_database.json

export const Initialize = async() => {
  let database, schedule, session;
  if (localStorage.getItem('vocabulary-database')) {
    database = JSON.parse(localStorage.getItem('vocabulary-database'))
  } else {
    database = (await axios.get(`${url}/api/vocabulary/vocabulary_database.json`)).data

    // cards = (await axios.post(`${url}/api/vocabulary/get`, /*null, { withCredentials: true }*/ )).data
    // cards = (cards.map(
    //   ({ data, ...other }) => ({ ...other, ...JSON.parse(data) })
    // ))
    localStorage.setItem('vocabulary-database', JSON.stringify(database))
    localStorage.setItem('vocabulary-database-last-updated', new Date().getTime())
  }
  //
  // if (localStorage.getItem('vocabulary-schedule')) {
  //   schedule = JSON.parse(localStorage.getItem('vocabulary-schedule'))
  // }
  //
  // // if (localStorage.getItem('vocabulary-session')) {
  // //   const parsed = JSON.parse(localStorage.getItem('vocabulary-session'))
  // //   if (parsed.savedAt + day > new Date().getTime()) {
  // //     session = parsed.session
  // //   }
  // // }
  //
  // const deck = new Deck(cards, schedule)
  // store.dispatch({
  //   type: 'LOAD_DECK',
  //   content: deck,
  // })
}
