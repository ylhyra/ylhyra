import forEachAsync from "app/app/functions/array-foreach-async";
import articles from "test/vocabulary/articles";
import easiness from "test/vocabulary/easiness";
import session from "test/vocabulary/session";
import vocabulary_signup_and_login from "test/vocabulary/signup_and_login";
import { run } from "test/functions";

/* Main test runner */
export default async (only_run) => {
  const toRun = {
    ...vocabulary_signup_and_login,
    ...articles,
    ...easiness,
    ...session,
  };
  await forEachAsync(Object.keys(toRun), async (key) => {
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

export const assert = (i, desc) => {
  if (!i) {
    throw new Error(desc);
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
