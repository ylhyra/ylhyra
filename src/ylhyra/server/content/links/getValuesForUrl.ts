import path from "path";
import { fileSafeTitle, formatUrl } from "ylhyra/server/content/links/paths";
import { appUrls } from "ylhyra/app/router/appUrls";
import { links } from "ylhyra/server/content/links/loadLinks";
import { LinkDataWithUrl } from "ylhyra/server/content/links/types";

export const getValuesForUrl = (url: string): LinkDataWithUrl | {} => {
  if (!url && url !== "") return {};
  url = formatUrl(url);
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
      filename: fileSafeTitle(url),
      url,
    };
  } else {
    return {};
  }
};
