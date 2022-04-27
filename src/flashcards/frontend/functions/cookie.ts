import { UserProfile } from "flashcards/frontend/user/types";
import { isBrowser } from "modules/isBrowser";
import { decodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";

export const COOKIE_NAME = "s";

export const getCookie = (name: string) => {
  const j = name + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(j) === 0) return c.substring(j.length, c.length);
  }
  return null;
};

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
