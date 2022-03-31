import { isDev } from "modules/isDev";

let l = {};
export const warnIfSlow = {
  start: (name) => {
    if (!isDev) return;
    l[name] = performance.now();
  },
  end: (name, max = 30) => {
    if (!isDev) return;
    if (l[name]) {
      const time = performance.now() - l[name];
      if (time > max) {
        console.warn(`"${name}" took ${Math.round(time)}ms`);
      }
    }
  },
};
