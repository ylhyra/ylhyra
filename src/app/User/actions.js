import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { connect } from "react-redux";
import store from "app/App/store";
import { updateURL } from "app/Router/actions";
import axios from "app/App/axios";
import { InitializeVocabulary } from "app/Vocabulary/actions/init";
import { getCookie } from "app/App/functions/cookie";
import { deck } from "app/Vocabulary/actions/deck";
import _ from "underscore";
import { sync } from "app/Vocabulary/actions/sync";
import { isBrowser } from "app/App/functions/isBrowser";

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
      console.log("Data not synced");
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
    const { user_id, username } = cookie;
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
