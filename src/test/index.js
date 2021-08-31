import forEachAsync from "app/App/functions/array-foreach-async";
import vocabulary_tests from "test/vocabulary.test";
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
      console.log(`%cThe test "${key}" is good!`, "font-size: large");
      resolve();
    });
  });
  console.log("%cAll tests good!", "font-size: x-large");
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
    assert(val && val !== "0");
  });
};

export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};
