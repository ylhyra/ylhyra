import { isDev } from "modules/isDev";
import { Milliseconds } from "modules/time";

/**
 * Warns in console if a function is too slow.
 * Wrap this around a function.
 */
export const warnIfFunctionIsSlow = <T extends Function>(
  name: string,
  fn: T,
  maxTimeMs = 30
): T => {
  return function (...args: any[]) {
    if (!isDev) return fn(...args);
    const start: Milliseconds = performance.now();
    const functionOutput = fn(...args);
    const time: Milliseconds = performance.now() - start;
    if (time > maxTimeMs) {
      console.warn(`Function "${name}" took ${Math.round(time)}ms`);
    }
    return functionOutput;
  } as unknown as T;
};
