import path from "path";

import { app_urls } from "app/router/appUrls";
import { FileSafeTitle, URL_title } from "app/app/paths";
import { links } from "server/content/loadLinks";

/**
 * Wrapper to be able to use in front and backend
 * @param {string} url
 * @returns {LinkDataWithUrl|{}}
 */
export const getValuesForURL = (url) => {
  if (!url && url !== "") return {};
  url = URL_title(url);
  let values = links[url];
  if (values) {
    if ("redirect_to" in values) {
      url = values.redirect_to;
      values = links[values.redirect_to];
    }
    values.url = url;
    values.filepath = values.filepath.replace(
      /^.+ylhyra_content/,
      path.resolve(process.env.PWD || ".", "./../ylhyra_content")
    );
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
