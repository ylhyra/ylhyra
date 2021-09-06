import forEachAsync from "app/app/functions/array-foreach-async";
import vocabulary_articles from "test/vocabulary/articles";
import vocabulary_easiness from "test/vocabulary/easiness";
import vocabulary_session from "test/vocabulary/session";
import vocabulary_signup_and_login from "test/vocabulary/sync";
import { run } from "test/functions";
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
    log(description);
    console.trace();
    throw new Error();
  }
};

export const notNull = (...vals) => {
  vals.forEach((val) => {
    if (!(val && val !== "0")) {
      console.trace();
      throw new Error("Received a null");
    }
  });
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};
