import {
  day,
  days,
  hours,
  minute,
  minutes,
  second,
  seconds,
} from "app/app/functions/time";
import express from "express";

export const cacheControl = (res, type) => {
  // if (isDev) return;
  let directives = {
    "stale-if-error": 365 * days,
  };
  if (type === "immutable") {
    directives["public"] = true;
    directives["immutable"] = true;
    directives["max-age"] = 365 * days;
  } else if (type === "html" || type === "cached_html") {
    directives["public"] = true;
    directives["max-age"] = 10 * seconds;
    directives["s-maxage"] = 1 * minute;
    directives["stale-while-revalidate"] = 10 * minutes;
    if (type === "cached_html") {
      directives["s-maxage"] = 1 * day;
      directives["max-age"] = 12 * hours;
    }
  }

  let output = [];
  Object.keys(directives).forEach((key) => {
    if (directives[key] === true) {
      output.push(key);
    } else {
      if (typeof directives[key] === "number") {
        /* Turn milliseconds into seconds */
        directives[key] /= second;
      }
      output.push(key + "=" + directives[key]);
    }
  });
  res.set("Cache-Control", output.join(", "));
};

export const staticCached = (path) => {
  return express.static(path, {
    setHeaders: (res) => {
      cacheControl(res, "immutable");
    },
  });
};
