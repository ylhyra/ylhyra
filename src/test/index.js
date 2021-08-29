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
export default async () => {
  const tests = {
    ...vocabulary_tests,
  };
  await forEachAsync(Object.keys(tests), async (key) => {
    await new Promise(async (resolve) => {
      await reset();
      await tests[key]();
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

export const mock_vocabulary_session = async () => {
  updateURL("VOCABULARY_PLAY");
  await deck.session.InitializeSession();
  for (let i = 0; i < 10; i++) {
    deck.session.answer(Math.ceil(Math.random() * 3));
  }
  await deck.session.sessionDone();
};

export const mock_signup = async () => {
  const username = "test_" + Math.round(Math.random() * 100000);
  await login({
    type: "signup",
    username,
    password: username,
  });
  return username;
};

export const mock_login = async (username) => {
  await login({
    type: "login",
    username,
    password: username,
  });
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};
