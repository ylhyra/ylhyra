import forEachAsync from "app/app/functions/array-foreach-async";
import { run } from "tests/integrationTests/functions";
import _ from "underscore";
import { log } from "app/app/functions/log";

const logger = window.logToPuppeteer || console.log;

/* Main test runner */
export default async (only_run) => {
  const toRun = {
    ...require("tests/integrationTests/vocabulary/articles.test").default,
    ...require("tests/integrationTests/vocabulary/easiness.test").default,
    ...require("tests/integrationTests/vocabulary/session_logging.test")
      .default,
    ...require("tests/integrationTests/vocabulary/sync.test").default,
  };
  await forEachAsync(_.shuffle(Object.keys(toRun)), async (key) => {
    await new Promise(async (resolve) => {
      if (only_run && key !== only_run) return resolve();
      logger(`Starting test "${key}"`);
      await run.reset();
      try {
        await toRun[key]();
      } catch (e) {
        console.trace();
        console.error(`Error in test "${key}"`, e.toString());
        return;
      }
      logger(`%cThe test "${key}" is good!`, "font-size: larger");

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

// const isDeckInitialized = async () => {
//   if (!deck) {
//     logger("Waiting for deck...");
//     await wait(300);
//     await isDeckInitialized();
//   }
// };
