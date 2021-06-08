import store from 'User/App/store'
import { url } from 'User/App/url'
import { history, urls } from 'User/Routes/router'
import axios from 'axios'
import { getCookie } from 'User/App/functions/cookie'
const SESSION_USER_ID = 'i' //TODO: Share with server

export const Initialize = async() => {
  console.log(getCookie(SESSION_USER_ID))
}

export const logout = async() => {
  const response = (await axios.post(`/api/user/logout`)).data
  store.dispatch({
    type: 'LOAD_USER',
    content: null,
  })
  history.push(urls.MAIN)
}
