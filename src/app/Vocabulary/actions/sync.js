import store from 'app/App/store'
import error from 'app/App/Error'
import axios from 'app/App/axios'
import { updateSchedule } from './scheduleAfterSession'
import { InitializeSession } from 'app/Vocabulary/actions/session'
import { url } from 'app/App/url'
import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'


export async function saveSchedule() {
  const deck = this

  // saveInLocalStorage('vocabulary-schedule', deck.schedule)

  await axios.post(`${url}/api/vocabulary/save`, {
    schedule: deck.schedule,
    user: store.getState().user,
  })

}
