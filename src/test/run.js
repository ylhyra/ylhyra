import { deck } from "app/Vocabulary/actions/deck";
import {
  PercentageKnown,
  PercentageKnownOverall,
} from "app/Vocabulary/actions/functions/percentageKnown";
import { updateURL } from "app/Router/actions";
import forEachAsync from "app/App/functions/array-foreach-async";
import { login, logout } from "app/User/actions.js";
import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import { InitializeVocabulary } from "app/Vocabulary/actions/init";
import vocabulary_tests from "test/vocabulary.test.js";

/* 
  Various smaller recipes 
*/
export const run = {
  reset: async () => {
    await logout();
    localStorage.clear();
    InitializeVocabulary();
  },
  start_session: async () => {
    updateURL("VOCABULARY_PLAY");
    await deck.session.InitializeSession();
  },
  end_session: async () => {
    await deck.session.sessionDone();
  },
  vocabulary_session: async (...vals) => {
    await run.start_session();
    if (vals) {
      vals.forEach((v) => {
        deck.session.answer(v);
      });
    } else {
      for (let i = 0; i < 10; i++) {
        deck.session.answer(Math.ceil(Math.random() * 3));
      }
    }
    await run.end_session();
  },
  signup: async () => {
    const username = "test_" + Math.round(Math.random() * 100000);
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
