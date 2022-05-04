import { isDev } from "modules/isDev";
import { Milliseconds } from "modules/time";

/**
 * Warns in console if a function is too slow.
 * Wrap this around a function.
 */
export const warnIfFunctionIsSlow = <T extends Function>(
  fn: T,
  maxTimeMs = 30
): T => {
  if (!isDev) return fn();
  const start: Milliseconds = performance.now();
  const functionOutput = fn();
  const time: Milliseconds = performance.now() - start;
  if (time > maxTimeMs) {
    console.warn(`This function took ${Math.round(time)}ms`);
  }
  return functionOutput;
};
