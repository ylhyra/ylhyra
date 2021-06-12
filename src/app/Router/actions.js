import store from 'app/App/store'
import { url_to_info } from 'app/Router/paths'

export const InitializeRouter = () => {
  updateURL(window.location.pathname + window.location.hash)
}

export const updateURL = (url, title) => {
  // url = url.replace(/#$/, '')
  const [pathname, section] = url.split('#')
  if (url !== window.location.pathname) {
    window.history.pushState(null, '', url);
  }

  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title
  }
  window.document.title = (title ? title + '\u200A•\u200A' : '') + 'Ylhýra'

  store.dispatch({
    type: 'ROUTE',
    content: {
      pathname: pathname,
      section: section,
    }
  })
}

export const getURL = () => {
  return window.location.pathname
}
