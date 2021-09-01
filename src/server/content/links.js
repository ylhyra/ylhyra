import { url_to_info } from "app/router/paths";
import { URL_title, FileSafeTitle } from "paths";
const fs = require("fs");

let _links = {};
try {
  _links = JSON.parse(fs.readFileSync(__basedir + `/build/links.json`, "utf8"));
} catch {}
export const links = _links;

export const getValuesForURL = (url, user_input_url) => {
  if (!url && url !== "") return {};
  url = URL_title(url);
  let values = links[url];
  if (values) {
    if ("redirect_to" in values) {
      values = links[values.redirect_to];
    } else if (user_input_url && user_input_url !== url) {
      values.redirect_to = url;
    }
    values.url = url;
    return values;
  } else if (url_to_info[url]) {
    return {
      title: "",
      filename: FileSafeTitle(url),
      url,
    };
  } else {
    return {};
  }
};
