import path from "path";
import { appUrls } from "ylhyra/app/router/appUrls";
import { fileSafeTitle } from "ylhyra/documents/compilation/links/format/fileSafeTitle";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";
import { links } from "ylhyra/documents/compilation/links/loadLinks.server";
import { LinkDataWithUrl } from "ylhyra/documents/types";

export const getValuesForUrl = (url: string): Partial<LinkDataWithUrl> => {
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
