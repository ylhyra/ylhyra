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
import { deck } from "app/Vocabulary/actions/deck.js";
import _ from "underscore";

export const InitializeUser = () => {
  updateUser();
};

export const getUserFromCookie = () => {
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
  const { user } = store.getState();
  return user !== null;
};

export const existsSchedule = () => {
  return deck && Object.keys(deck.schedule).length >= 6;
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

export const login = async ({ username, user_id, save_progress }) => {
  store.dispatch({
    type: "LOAD_USER",
    content: {
      username,
      user_id,
    },
  });
  if (save_progress) {
    deck.syncSchedule({ syncEntireSchedule: true });
  } else {
    saveInLocalStorage("vocabulary-schedule", null);
    saveInLocalStorage("vocabulary-session", null);
    InitializeVocabulary();
  }
};

export const logout = async () => {
  const response = (await axios.post(`/api/user/logout`)).data;
  store.dispatch({
    type: "LOAD_USER",
    content: null,
  });
  store.dispatch({
    type: "LOAD_SESSION",
    content: null,
  });
  saveInLocalStorage("vocabulary-schedule", null);
  saveInLocalStorage("vocabulary-session", null);
  InitializeVocabulary();
  updateURL("/");
};

export const MIN_PRICE = 2;
export const MAX_PRICE = 200;
export const pay = ({ price }) => {
  price = parsePrice(price);
  if (price === "TOO_SMALL") {
    updateURL("/");
    return;
  }
};

export const parsePrice = (price) => {
  price = price
    .toString()
    .replace(/\s/g, "")
    .replace(/\$/g, "")
    .replace(/,([0-9]{1,2})$/, ".$1")
    .replace(/,/, "");
  if (/[^0-9.]/.test(price)) {
    return { error: "INVALID_NUMBER" };
  }
  const [d, c] = price.split(".");
  const cents =
    parseInt(d) * 100 + (c ? Math.floor((parseInt(c) / c.length) * 100) : 0);
  if (cents > MAX_PRICE * 100) {
    return { error: "TOO_LARGE" };
  }
  if (cents < MIN_PRICE * 100) {
    return { error: "TOO_SMALL" };
  }
  return (cents / 100).toFixed(2);
  // const d1 = Math.floor(cents / 100);
  // const c1 = Math.floor(cents - d1 * 100);
  // return d1 + "." + c1;
};
