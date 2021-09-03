import { updateURL } from "app/router/actions/updateURL";
import { login, logout } from "app/user/actions";
import { deck } from "app/vocabulary/actions/deck";
import { InitializeVocabulary } from "app/vocabulary/actions/initialize";
import { eraseCookie } from "app/app/functions/cookie";
import { wait } from "test/index";

/* 
  Various smaller recipes 
*/
export const run = {
  reset: async () => {
    await logout();
    localStorage.clear();
    eraseCookie();
    await InitializeVocabulary();
  },
  start_session: async () => {
    updateURL("/vocabulary/play");
    await deck.session.InitializeSession();
  },
  end_session: async () => {
    await deck.session.sessionDone();
  },
  vocabulary_session: async (options = {}) => {
    await run.start_session();
    if (options.values) {
      options.values.forEach((v) => {
        deck.session.answer(v);
      });
    } else {
      for (let i = 0; i < 10; i++) {
        deck.session.answer(Math.ceil(Math.random() * 3));
      }
    }
    if (!options.dontEnd) {
      await run.end_session();
    }
  },
  fakeReload: async () => {
    deck.reset({ dontClear: true });
    updateURL("/vocabulary");
    await wait(500);
    await InitializeVocabulary();
  },
  signup: async () => {
    const username = "test_" + Math.round(Math.random() * 1000000);
    await login({
      type: "signup",
      username,
      password: username,
    });
    window.last_username = username;
    return username;
  },
  login: async (username) => {
    username = username || window.last_username;
    if (!username) {
      throw new Error("No username");
    }
    await login({
      type: "login",
      username,
      password: username,
    });
  },
  signup_logout_login: async () => {
    await run.signup();
    await run.reset_and_login();
  },
  reset_and_login: async () => {
    await run.reset();
    await run.login();
  },
};

window.run = run;
