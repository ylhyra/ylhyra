import axios from "ylhyra/app/app/axios";
import { eraseCookie } from "ylhyra/app/app/functions/cookie";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { login, logout } from "ylhyra/app/user/actions";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { PercentageKnownOverall } from "ylhyra/app/vocabulary/actions/functions/percentageKnown";
import { initializeVocabulary } from "ylhyra/app/vocabulary/actions/initialize";
import { assert, wait } from "ylhyra/tests/integrationTests/index";

/* 
  Various smaller recipes 
*/
export const run = {
  reset: async () => {
    await logout();
    localStorage.clear();
    eraseCookie();
    deck?.reset();
    await initializeVocabulary();
    await wait(20);
    assert(PercentageKnownOverall() === 0);
    goToUrl("/vocabulary");
  },
  start_session: async () => {
    goToUrl("/vocabulary/play");
    await deck.session.initializeSession();
  },
  end_session: async () => {
    await deck.session.sessionDone();
  },
  vocabulary_session: async (options = {}) => {
    if (!options.dontStart) {
      await run.start_session();
    }
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
  start_vocabulary_session: async (options = {}) => {
    await run.vocabulary_session({
      values: options.values,
      dontEnd: true,
    });
  },
  continue_vocabulary_session: async (options = {}) => {
    await run.vocabulary_session({
      values: options.values,
      dontStart: true,
      dontEnd: true,
    });
  },
  end_vocabulary_session: async (options = {}) => {
    await run.vocabulary_session({
      values: options.values,
      dontStart: true,
    });
  },
  fakeReload: async () => {
    deck.clear();
    goToUrl("/vocabulary");
    await wait(500);
    await initializeVocabulary();
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
  logout: async () => {
    await logout();
  },
  logout_only_in_backend: async () => {
    await axios.post(`/api/user/logout`);
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
