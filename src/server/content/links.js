import { app_urls } from "app/router/appUrls";
import { FileSafeTitle, URL_title } from "app/app/paths";

const fs = require("fs");

let _links = {};
try {
  _links = JSON.parse(fs.readFileSync(__basedir + `/build/links.json`, "utf8"));
} catch {}
export const links = _links;

/**
 * @param {string} url
 * @returns {{}|{filename: string, title: string, url: string}}
 */
export const getValuesForURL = (url) => {
  if (!url && url !== "") return {};
  url = URL_title(url);
  let values = links[url];
  if (values) {
    if ("redirect_to" in values) {
      values = links[values.redirect_to];
    }
    return values;
  } else if (url in app_urls) {
    return {
      title: "",
      filename: FileSafeTitle(url),
      url,
    };
  } else {
    return {};
  }
};
