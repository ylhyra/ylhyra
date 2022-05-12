import { isDev } from "modules/isDev";
import { Milliseconds, Timestamp } from "modules/time";
import { entries } from "modules/typescript/objectEntries";
import _ from "underscore";

let functionStartedAt: Record<string, Timestamp> = {};
let timer: NodeJS.Timeout;
let functionsAndTheirTotalTime: Record<string, Milliseconds> = {};
export const warnIfFunctionIsSlow = {
  start: (name?: string) => {
    if (!isDev) return;
    if (!name) {
      name = new Error().stack?.split("\n")[2]?.split(" ")[5]!;
    }
    functionStartedAt[name] = performance.now();
  },
  end: (name?: string, maxMs: Milliseconds = 30) => {
    if (!isDev) return;
    if (!name) {
      name = new Error().stack?.split("\n")[2]?.split(" ")[5]!;
    }

    if (functionStartedAt[name]) {
      const time: Milliseconds = performance.now() - functionStartedAt[name];
      functionsAndTheirTotalTime[name] =
        (functionsAndTheirTotalTime[name] || 0) + time;
      timer && clearTimeout(timer);
      timer = setTimeout(printFunctionsThatTookTooMuchTimeInTheLastSecond, 200);
    }
  },
  /** Can wrap around non-async function */
  wrap: <T extends () => any>(fn: T, name?: string): ReturnType<T> => {
    if (!isDev) return fn();
    if (!name) {
      name = new Error().stack?.split("\n")[2]?.split(" ")[5];
    }
    warnIfFunctionIsSlow.start(name);
    const functionOutput = fn();
    warnIfFunctionIsSlow.end(name);
    return functionOutput;
  },
};

// /**
//  * Warns in console if a function is too slow.
//  * Wrap this around the inner portions of a function.
//  * Must wrap around an anonymous argument-less function.
//  *
//  * const functionName = () => {
//  *   return warnIfFunctionIsSlow2(() => {
//  *     ...
//  *   });
//  * };
//  *
//  * Sums up the time spent in each function (summing by each second).
//  */
// export const warnIfFunctionIsSlow = <T extends () => any>(
//   fn: T,
//   /** Must be passed if async function */
//   functionName?: string
// ): ReturnType<T> => {
//   if (!isDev) return fn();
//
//   if (!functionName) {
//     functionName = new Error().stack?.split("\n")[2]?.split(" ")[5];
//   }
//   const start: Milliseconds = performance.now();
//   const functionOutput = fn();
//   const time: Milliseconds = performance.now() - start;
//   functionsAndTheirTotalTime[functionName!] =
//     (functionsAndTheirTotalTime[functionName!] || 0) + time;
//   timer && clearTimeout(timer);
//   timer = setTimeout(printFunctionsThatTookTooMuchTimeInTheLastSecond, 200);
//   return functionOutput;
// };

export const printFunctionsThatTookTooMuchTimeInTheLastSecond = () => {
  const maxTotalTimeMs = 10;
  _.sortBy(entries(functionsAndTheirTotalTime), (j) => j[1]).forEach(
    ([name, time]) => {
      if (time > maxTotalTimeMs) {
        console.warn(
          `Function "${name}" took a total of ${Math.round(time)}ms`
        );
      }
    }
  );
  functionsAndTheirTotalTime = {};
};
