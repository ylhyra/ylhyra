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
  return Boolean(user);
};

export const existsSchedule = () => {
  return deck && Object.keys(deck.schedule).length >= 2;
};

// export const isUserNotLoggedInAndHasUnsavedSchedule = () => {
// };

/* Called on route changes */
export const updateUser = () => {
  const x = getUserFromCookie();
  if (
    (store.getState().user && store.getState().user.user_id) !==
    (x && x.user_id)
  ) {
    store.dispatch({
      type: "LOAD_USER",
      content: x,
    });
  }
};

export const login = async ({ username, user_id }) => {
  store.dispatch({
    type: "LOAD_USER",
    content: {
      username,
      user_id,
    },
  });
  /* TODO!!! Save logged-out schedule if new user */
  saveInLocalStorage("vocabulary-schedule", null);
  saveInLocalStorage("vocabulary-session", null);
  InitializeVocabulary();
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

// todo: minimum
const MAX = 80;
const MIN = 2;
export const pay = ({ price }) => {
  price = price.replace(/,/, ".");

  updateURL("/");
};
