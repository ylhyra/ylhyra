import { URL_title } from "app/app/paths";
import { app_urls } from "app/router/appUrls";
import { getValuesForURL } from "server/content/links";
import { links } from "server/content/loadLinks";

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
          let values = getValuesForURL(link);

          if (text === "masculine") {
            console.log(values);
          }
          const [title, input_section] = link.split("#");
          if (
            !(link in app_urls) &&
            (!values.url || !values?.shouldBeCreated)
          ) {
            return text;
          }
          if (links[title]?.redirect_to) {
            link =
              links[link].redirect_to +
              (links[link].section ? "#" + links[link].section : "");
          }
          return `<a href="${encodeURI(values.url)}">${text}</a>`;
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
