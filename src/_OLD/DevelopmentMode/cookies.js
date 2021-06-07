import { isBrowser } from 'User/App/functions/isBrowser'

/*

  window.ylhyraDevelopment(true)

*/
export function setCookie(name, value, days, options) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + `;${options||''} path=/`;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

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