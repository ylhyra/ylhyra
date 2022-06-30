// @ts-nocheck
import { isBrowser } from "modules/isBrowser";
import { log } from "modules/log";
import axios from "ylhyra/app/app/axios";
import { getCookie } from "ylhyra/app/app/functions/cookie";
import store from "ylhyra/app/app/store";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { decodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";

import { sync } from "ylhyra/vocabulary/app/actions/userData/sync";
import { clearOverview } from "ylhyra/vocabulary/app/elements/OverviewScreen/actions";

export async function login(values) {
  const response = (await axios.post("/api/user", values)).data;
  const { user_id, username, did_user_exist, error } = response;
  if (error) return error;

  store.dispatch({
    type: "LOAD_USER",
    content: {
      username,
      user_id,
    },
  });

  if (!did_user_exist) {
    if (values.save_progress !== "no") {
      await sync({ syncEverything: true });
    } else {
      log("Data not synced");
      deck!.reset();
    }

    if (process.env.REACT_APP_PWYW === "on") {
      goToUrl("/pwyw");
    } else {
      // TODO: "Thank you for ..."
      goToUrl("/vocabulary");
    }
  } else {
    /* TODO!!!!! */
    deck!.reset();
    await sync();
    goToUrl("/vocabulary");
  }
  void clearOverview();
}

export async function logout() {
  await axios.post(`/api/user/logout`);
  deck?.reset();
  clearOverview();
  store.dispatch({
    type: "LOAD_USER",
    content: null,
  });
  goToUrl("/frontpage");
}

export function initializeUser() {
  updateUser();
}

export type UserInfo = {
  user_id: Number;
  username: string;
};
export function getUserFromCookie(): UserInfo | null {
  if (!isBrowser) return null;
  let cookie = getCookie("y");
  if (cookie) {
    let { user_id, username, username_encoded } = JSON.parse(atob(cookie));
    /* "username" is no longer used but is kept here temporarily for
     users who already have that cookie set */
    if (username_encoded) {
      username = decodeDataInHtml(username_encoded, true);
    }
    if (user_id) {
      return { user_id, username };
    }
  }
  return null;
}

export function isUserLoggedIn() {
  return getUserFromCookie() !== null;
}

export function existsSchedule() {
  return getEntireSchedule() && Object.keys(getEntireSchedule()).length >= 6;
}

/* Called on route changes */
// TODO!! Should sync
export function updateUser() {
  const user = getUserFromCookie();
  if (store.getState().user?.user_id !== user?.user_id) {
    store.dispatch({
      type: "LOAD_USER",
      content: user,
    });
  }
}
