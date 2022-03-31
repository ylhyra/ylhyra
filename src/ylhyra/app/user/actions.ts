import axios from "ylhyra/app/app/axios";
import { getCookie } from "ylhyra/app/app/functions/cookie";
import { isBrowser } from "modules/isBrowser";
import { log } from "modules/log";
import store from "ylhyra/app/app/store";
import { updateURL } from "ylhyra/app/router/actions/updateURL";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { sync } from "ylhyra/app/vocabulary/actions/userData/sync";
import { clearOverview } from "ylhyra/app/vocabulary/elements/OverviewScreen/actions";
import { decodeDataInHtml } from "ylhyra/documents/compile/functions/functions";

export const login = async (values) => {
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
      deck.reset();
    }

    if (process.env.REACT_APP_PWYW === "on") {
      void updateURL("/pwyw");
    } else {
      // TODO: "Thank you for ..."
      void updateURL("/vocabulary");
    }
  } else {
    /* TODO!!!!! */
    deck.reset();
    await sync();
    void updateURL("/vocabulary");
  }
  void clearOverview();
};

export const logout = async () => {
  await axios.post(`/api/user/logout`);
  deck?.reset();
  clearOverview();
  store.dispatch({
    type: "LOAD_USER",
    content: null,
  });
  void updateURL("/frontpage");
};

export const InitializeUser = () => {
  updateUser();
};

export type UserInfo = {
  user_id: Number;
  username: string;
};
export const getUserFromCookie = (): UserInfo | null => {
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
};

export const isUserLoggedIn = () => {
  return getUserFromCookie() !== null;
};

export const existsSchedule = () => {
  return deck?.schedule && Object.keys(deck.schedule).length >= 6;
};

/* Called on route changes */
// TODO!! Should sync
export const updateUser = () => {
  const user = getUserFromCookie();
  if (store.getState().user?.user_id !== user?.user_id) {
    store.dispatch({
      type: "LOAD_USER",
      content: user,
    });
  }
};
