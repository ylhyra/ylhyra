import path from "path";
import { FileSafeTitle, URL_title } from "ylhyra/app/app/paths";
import { appUrls } from "ylhyra/app/router/appUrls";
import { LinkDataWithUrl } from "ylhyra/server/content/links/generateLinks";
import { links } from "ylhyra/server/content/links/loadLinks";

/**
 * Wrapper to be able to use in front and backend
 */
export const getValuesForURL = (url: string): LinkDataWithUrl | {} => {
  if (!url && url !== "") return {};
  url = URL_title(url);
  let values = links[url];
  let section;
  if (values) {
    if ("redirect_to" in values) {
      url = values.redirect_to;
      section = values.section;
      values = links[values.redirect_to];
    }
    values.url = url;
    if (section) {
      values.section = section;
    }
    values.filepath = values.filepath.replace(
      /^.+ylhyra_content/,
      path.resolve(process.env.PWD || ".", "./../ylhyra_content")
    );
    return values;
  } else if (url in appUrls) {
    return {
      title: "",
      filename: FileSafeTitle(url),
      url,
    };
  } else {
    return {};
  }
};
