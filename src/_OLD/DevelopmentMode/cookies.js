import { isBrowser } from 'User/App/functions/isBrowser'

/*

  window.ylhyraDevelopment(true)

*/

if (isBrowser) {
  window.ylhyraDevelopment = (value) => {
    setCookie('development', value.toString());
  }

  window.serverSideRendering = (value) => {
    setCookie('server-side-rendering', value.toString());
  }

  if (getCookie('server-side-rendering') === 'false') {
    console.warn('Server side rendering off')
  }

  if (getCookie('development') === 'true') {
    window.developmentMode = true
  }
}
