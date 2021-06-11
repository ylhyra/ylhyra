import store from 'app/App/store'

export const updateURL = (url) => {
  window.location.pathname = 'haah'
  store.dispatch({
    type: 'ROUTE',
    pathname: null,
    section: null,
  })
}

export const getURL = () => {
  return window.location.pathname
  // window.location.href
}
