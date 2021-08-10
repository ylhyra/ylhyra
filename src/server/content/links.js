import { url_to_info } from "app/Router/paths";
import { URL_title, FileSafeTitle } from "paths";

let _links = {};
try {
  _links = require("build/links.js");
} catch (e) {}
export const links = _links;

export const getValuesForURL = (url, user_input_url) => {
  if (!url && url !== "") return {};
  url = URL_title(url);
  let values = links[url];
  if (values) {
    values.url = url;
    if ("redirect_to" in values) {
      values.url = values.redirect_to;
      values.file = links[values.redirect_to].file;
      values.title = links[values.redirect_to].title;
      values.filename = links[values.redirect_to].filename;
    } else if (user_input_url && user_input_url !== url) {
      values.redirect_to = url;
    }
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
