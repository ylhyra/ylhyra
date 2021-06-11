import store from 'app/App/store'
import { url_to_info } from 'app/Router/urls'

export const InitializeRouter = () => {
  updateURL(window.location.pathname)
}

export const updateURL = (url, title) => {
  const [pathname, section] = url.split('#')
  window.history.pushState(null, '', url);

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
  return {
    pathname: window.location.pathname,
  }
}
