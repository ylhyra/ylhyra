import store from 'User/App/store'
import { url } from 'User/App/url'
import { history, urls } from 'User/Routes/router'
import axios from 'User/App/axios'
import { getCookie } from 'User/App/functions/cookie'

/*
todo: Poll to check if user has logged in on another session
*/

export const InitializeUser = () => {
  let cookie = getCookie('y')
  if (cookie) {
    cookie = JSON.parse(atob(cookie))
    const user_id = cookie.user_id
    const user = cookie.user
    if (user_id) {
      return {
        user,
        user_id,
      }
    }
  }
  return null
}

export const logout = async() => {
  const response = (await axios.post(`/api/user/logout`)).data
  store.dispatch({
    type: 'LOAD_USER',
    content: null,
  })
  history.push(urls.MAIN)
}
