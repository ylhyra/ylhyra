import forEachAsync from "app/app/functions/array-foreach-async";
import vocabulary_articles from "tests/integration/vocabulary/articles.test";
import vocabulary_easiness from "tests/integration/vocabulary/easiness.test";
import vocabulary_session from "tests/integration/vocabulary/session_logging.test";
import vocabulary_signup_and_login from "tests/integration/vocabulary/sync.test";
import { run } from "tests/integration/functions";
import _ from "underscore";
import { log } from "app/app/functions/log";

/* Main test runner */
export default async (only_run) => {
  const toRun = {
    ...vocabulary_signup_and_login,
    ...vocabulary_articles,
    ...vocabulary_easiness,
    ...vocabulary_session,
  };
  await forEachAsync(_.shuffle(Object.keys(toRun)), async (key) => {
    await new Promise(async (resolve) => {
      if (only_run && key !== only_run) return resolve();
      await run.reset();
      try {
        await toRun[key]();
      } catch (e) {
        console.trace();
        console.error(`Error in test ${key}`);
        console.error(e);
        return;
      }
      console.log(`%cThe test "${key}" is good!`, "font-size: larger");
      resolve();
    });
  });
  !only_run && console.log("%cAll tests good!", "font-size: x-large");
};

export const shouldEqual = (first, second) => {
  if (first !== second) {
    throw new Error(`NOT EQUAL: Received ${first} and ${second}`);
  }
};

export const assert = (i, ...description) => {
  if (!i) {
    // log(description);
    throw new Error(description);
  }
};

export const notNull = (...vals) => {
  vals.forEach((val) => {
    if (!(val && val !== "0")) {
      throw new Error("Received a null");
    }
  });
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};
