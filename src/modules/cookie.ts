import { decodeDataInHtml } from "modules/base64";
import { isBrowser } from "modules/isBrowser";
import { UserProfile } from "types";

export const COOKIE_NAME = "s";

export function getCookie(name: string) {
  var j = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(j) === 0) return c.substring(j.length, c.length);
  }
  return null;
}

export const getUserFromCookie = (): UserProfile => {
  if (!isBrowser) return null;
  let cookie = getCookie(COOKIE_NAME);
  if (cookie) {
    let { userId, usernameEncoded } = JSON.parse(atob(cookie));
    if (userId) {
      return { userId, username: decodeDataInHtml(usernameEncoded, true) };
    }
  }
  return null;
};
