import store from 'app/App/store'
import { url_to_info } from 'app/Router/paths'

window.addEventListener('popstate', (event) => {
  updateURL(window.location.pathname)
})

export const InitializeRouter = () => {
  updateURL(window.location.pathname + window.location.hash)
}

export const updateURL = (url, title, replace) => {
  if (!url.startsWith('/')) {
    url = '/' + url
  }
  const [pathname, section] = url.split('#')
  if (url !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }
  }

  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title
  }
  window.document.title = (title ? title + ' • ' : '') + 'Ylhýra'

  if (!replace) {
    store.dispatch({
      type: 'ROUTE',
      content: {
        pathname: pathname,
        section: section,
      }
    })
  }
}

export const getURL = () => {
  return window.location.pathname
}
