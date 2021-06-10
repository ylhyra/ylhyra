import store from 'app/App/store'
import { url } from 'app/App/url'
import { history, urls } from 'app/Routes/router'
import axios from 'app/App/axios'
import { getCookie } from 'app/App/functions/cookie'

/*
todo: Poll to check if user has logged in on another session
*/

export const InitializeUser = () => {
  let cookie = getCookie('y')
  if (cookie) {
    cookie = JSON.parse(atob(cookie))
    const user = cookie.user
    if (user) {
      return user
    }
  }
  return null
}
/* Called on route changes */
export const updateUser = () => {
  store.dispatch({
    type: 'LOAD_USER',
    content: InitializeUser(),
  })
}

export const logout = async() => {
  const response = (await axios.post(`/api/user/logout`)).data
  store.dispatch({
    type: 'LOAD_USER',
    content: null,
  })
  history.push(urls.MAIN)
}


// todo: minimum
const MAX = 80
const MIN = 2
export const pay = ({ price }) => {
  price = price.replace(/,/,'.')

  history.push(urls.MAIN)
}
