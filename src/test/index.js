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
import { run } from "./run";

/* Main test runner */
export default async (only_run) => {
  const tests = {
    ...vocabulary_tests,
  };
  await forEachAsync(Object.keys(tests), async (key) => {
    await new Promise(async (resolve) => {
      if (only_run && key !== only_run) return resolve();
      await run.reset();
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

export const assert = (i) => {
  if (!i) {
    throw new Error();
  }
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};
