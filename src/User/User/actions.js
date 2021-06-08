import store from 'User/App/store'
import { url } from 'User/App/url'
import { history, urls } from 'User/Routes/router'
import axios from 'axios'
import { getCookie } from 'User/App/functions/cookie'

/*
todo: Poll to check if user has logged in on another session
*/

export const InitializeUser = async() => {
  let cookie = getCookie('y')
  if (cookie) {
    cookie = JSON.parse(atob(cookie))
    const user_id = cookie.user_id
    const user = cookie.user
    if (user_id) {
      store.dispatch({
        type: 'LOAD_USER',
        content: {
          user,
          user_id,
        },
      })
    }
  }
}

export const logout = async() => {
  const response = (await axios.post(`/api/user/logout`)).data
  store.dispatch({
    type: 'LOAD_USER',
    content: null,
  })
  history.push(urls.MAIN)
}
