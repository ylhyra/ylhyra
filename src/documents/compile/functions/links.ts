import { URL_title } from "app/app/paths";
import { app_urls } from "app/router/appUrls";
import { getValuesForURL } from "server/content/links";

export const ProcessLinks = (
  input
  // links /* Links passed specifically so that this can be used in the frontend */
) => {
  return (
    input
      /* Internal links */
      .replace(/\[\[(.+?)\]\]([a-záéíúóðþýöæ]+)?/gi, (x, match, after) => {
        let [link, text] = match.split("|");
        link = link.trim();
        text = (text || link).trim() + (after || "");
        if (/^:?w:/i.test(link)) {
          link = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            link.replace(/^w:/i, "")
          )}`;
          return `<a href="${link}">${text}</a>`;
        } else {
          link = URL_title(link);
          const [input_url, input_section] = link.split("#");
          let values = getValuesForURL(input_url);

          // if (values.url === "/g") {
          //   console.log(values);
          // }

          if (!(input_url in app_urls) && !values?.shouldBeCreated) {
            return text;
          }

          let url = encodeURI(values.url || input_url /*For appurls*/);
          let section = values.section || input_section;
          if (section) {
            url += "#" + encodeURI(section);
          }

          return `<a href="${url}">${text}</a>`;
        }
      })
      /* Bare external links */
      .replace(/\[((?:http|mailto)[^ ]+?)\]/g, (x, url) => {
        return `&#91;<a href="${url}">link</a>&#93;`;
      })
      /* External links */
      .replace(/\[((?:http|mailto)[^ ]+?) (.+?)\]/g, (x, url, text) => {
        return `<a href="${url}">${text}</a>`;
      })
  );
};
