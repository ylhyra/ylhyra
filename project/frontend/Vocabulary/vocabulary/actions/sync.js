import store from 'App/store'
import error from 'App/Error'
import axios from 'axios'
import { updateSchedule } from './scheduleAfterSession'
import { InitializeSession } from 'Vocabulary/vocabulary/actions/session'
import { url } from 'App/url'
import { saveInLocalStorage, getFromLocalStorage } from 'project/frontend/App/functions/localStorage'


export async function saveSchedule() {
  const deck = this

  // saveInLocalStorage('vocabulary-schedule', deck.schedule)

  await axios.post(`${url}/api/vocabulary/save`, {
    schedule: deck.schedule,
    user: store.getState().user,
  })

}
