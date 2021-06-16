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
  url = decodeURI(url)

  const [pathname, section] = url.split('#')
  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title
  }
  window.document.title = (title ? title + '\u2006•\u200A' : '') + 'Ylhýra'

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
    /* ?? */
    window.history.pushState(null, '', window.location.pathname);
    return;
  }

  if (url !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }
  }

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
