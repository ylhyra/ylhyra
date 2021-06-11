import store from 'app/App/store'
import { history, urls } from 'app/Routes/router'
import axios from 'app/App/axios'
import { getCookie } from 'app/App/functions/cookie'

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
    (this.state.user && this.state.user.user_id) !==
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
  history.push(urls.MAIN)
}


// todo: minimum
const MAX = 80
const MIN = 2
export const pay = ({ price }) => {
  price = price.replace(/,/, '.')

  history.push(urls.MAIN)
}
