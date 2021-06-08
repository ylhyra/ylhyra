import store from 'User/App/store'
import error from 'User/App/Error'
import axios from 'User/App/axios'
import { updateSchedule } from './scheduleAfterSession'
import { InitializeSession } from 'User/Vocabulary/actions/session'
import { url } from 'User/App/url'
import { saveInLocalStorage, getFromLocalStorage } from 'User/App/functions/localStorage'


export async function saveSchedule() {
  const deck = this

  // saveInLocalStorage('vocabulary-schedule', deck.schedule)

  await axios.post(`${url}/api/vocabulary/save`, {
    schedule: deck.schedule,
    user: store.getState().user,
  })

}
