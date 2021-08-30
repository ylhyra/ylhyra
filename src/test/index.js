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

/* Main test runner */
export default async (only_run) => {
  const tests = {
    ...vocabulary_tests,
  };
  await forEachAsync(Object.keys(tests), async (key) => {
    await new Promise(async (resolve) => {
      if (only_run && key !== only_run) return resolve();
      await reset();
      try {
        await tests[key]();
      } catch (e) {
        console.error(e);
        return;
      }
      console.log(`The test "${key}" is good!`);
      resolve();
    });
  });
  console.log("All tests good!");
};

export const shouldEqual = (first, second) => {
  if (first !== second) {
    throw new Error(`NOT EQUAL: Received ${first} and ${second}`);
  }
};

export const reset = async () => {
  await logout();
  localStorage.clear();
  InitializeVocabulary();
};

export const run = {
  vocabulary_session: async (...vals) => {
    updateURL("VOCABULARY_PLAY");
    await deck.session.InitializeSession();
    if (vals) {
      vals.forEach((v) => {
        deck.session.answer(v);
      });
    } else {
      for (let i = 0; i < 10; i++) {
        deck.session.answer(Math.ceil(Math.random() * 3));
      }
    }
    await deck.session.sessionDone();
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
    await reset();
    await run.login();
  },
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};

window.run = run;
