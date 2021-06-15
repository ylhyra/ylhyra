import store from 'app/App/store'
import { url_to_info } from 'app/Router/paths'
import { urls as app_urls } from 'app/Router/paths'

window.addEventListener('popstate', (event) => {
  updateURL(window.location.pathname)
})

export const InitializeRouter = () => {
  updateURL(window.location.pathname + window.location.hash)
}

export const updateURL = (url, title, replace) => {
  if (url in app_urls) {
    url = app_urls[url].url
  }
  if (!url.startsWith('/')) {
    url = '/' + url
  }

  /*
    Force vocabulary game to keep the URL of the article it is started on
  */
  if (url === '/vocabulary/play') {
    store.dispatch({
      type: 'ROUTE',
      content: {
        pathname: url,
      }
    })
    return;
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
  window.document.title = (title ? title + '\u2006•\u200A' : '') + 'Ylhýra'

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
  return decodeURI(window.location.pathname)
    .replace(/^\//, '')
}
