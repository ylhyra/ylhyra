import { isDev } from "modules/isDev";
import { Milliseconds, Timestamp } from "modules/time";

let functionStartedAt: Record<string, Timestamp> = {};
export const warnIfFunctionIsSlow = {
  start: (name: string) => {
    if (!isDev) return;
    functionStartedAt[name] = performance.now();
  },
  end: (name: string, maxMs: Milliseconds = 30) => {
    if (!isDev) return;
    if (functionStartedAt[name]) {
      const time: Milliseconds = performance.now() - functionStartedAt[name];
      if (time > maxMs) {
        console.warn(`"${name}" took ${Math.round(time)}ms`);
      }
    }
  },
};
