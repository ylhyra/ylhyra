import { log } from "app/app/functions/log";
import axios from "app/app/axios";
import { getCookie } from "app/app/functions/cookie";
import { isBrowser } from "app/app/functions/isBrowser";
import store from "app/app/store";
import { updateURL } from "app/router/actions/updateURL";
import { deck } from "app/vocabulary/actions/deck";
import { sync } from "app/vocabulary/actions/sync";
import _ from "underscore";
import { DecodeDataInHTML } from "documents/compile/functions/functions";

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
      updateURL("/pay-what-you-want");
    } else {
      updateURL("/vocabulary");
    }
  } else {
    /* TODO!!!!! */
    deck.reset();
    await sync();
    updateURL("/vocabulary");
  }
};

export const logout = async () => {
  const response = (await axios.post(`/api/user/logout`)).data;
  deck.reset();
  store.dispatch({
    type: "LOAD_USER",
    content: null,
  });
  updateURL("/frontpage");
};

export const InitializeUser = () => {
  updateUser();
};

export const getUserFromCookie = () => {
  if (!isBrowser) return null;
  let cookie = getCookie("y");
  if (cookie) {
    cookie = JSON.parse(atob(cookie));
    let { user_id, username, username_encoded } = cookie;
    /* "username" is no longer used but is kept here for
     users who already have that cookie set */
    if (username_encoded) {
      username = DecodeDataInHTML(username_encoded, true);
    }
    if (user_id) {
      return { user_id, username };
    }
  }
  return null;
};

export const isUserLoggedIn = () => {
  return getUserFromCookie() !== null;
  // const { user } = store.getState();
  // return user !== null;
};

export const existsSchedule = () => {
  return deck?.schedule && Object.keys(deck.schedule).length >= 6;
};

export const termsInSchedule = () => {
  if (!deck) return null;
  return _.uniq(
    _.flatten(
      Object.keys(deck.schedule).map((card_id) => deck.cards[card_id]?.terms)
    )
  ).length;
};

/* Called on route changes */
export const updateUser = () => {
  const x = getUserFromCookie();
  if (store.getState().user?.user_id !== x?.user_id) {
    store.dispatch({
      type: "LOAD_USER",
      content: x,
    });
  }
};
