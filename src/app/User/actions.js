import { saveInLocalStorage, getFromLocalStorage } from 'app/App/functions/localStorage'
import { connect } from 'react-redux';
import store from 'app/App/store'
import { updateURL } from 'app/Router/actions'
import axios from 'app/App/axios'
import { InitializeVocabulary } from 'app/Vocabulary/actions/init'
import { getCookie } from 'app/App/functions/cookie'

export const InitializeUser = () => {
  updateUser()
}
export const getUserFromCookie = () => {
  let cookie = getCookie('y')
  if (cookie) {
    cookie = JSON.parse(atob(cookie))
    const { user_id, username } = cookie
    if (user_id) {
      return { user_id, username }
    }
  }
  return null
}

/* Called on route changes */
export const updateUser = () => {
  const x = getUserFromCookie()
  if (
    (store.getState().user && store.getState().user.user_id) !==
    (x && x.user_id)) {
    store.dispatch({
      type: 'LOAD_USER',
      content: x,
    })
  }
}

export const logout = async() => {
  const response = (await axios.post(`/api/user/logout`)).data
  store.dispatch({
    type: 'LOAD_USER',
    content: null,
  })
  store.dispatch({
    type: 'LOAD_SESSION',
    content: null,
  })
  saveInLocalStorage('vocabulary-schedule', null)
  saveInLocalStorage('vocabulary-session', null)
  InitializeVocabulary()
  updateURL('MAIN')
}


// todo: minimum
const MAX = 80
const MIN = 2
export const pay = ({ price }) => {
  price = price.replace(/,/, '.')

  updateURL('MAIN')
}
