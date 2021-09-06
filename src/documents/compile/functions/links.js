import { URL_title } from "paths";
import { app_urls } from "app/router/paths";
// import { links, getValuesForURL } from "server/content/links";

export const ProcessLinks = (input, links) => {
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
          const [title] = link.split("#");
          if (links) {
            if (title && !(title in links) && !(link in app_urls)) {
              return text;
            }
            if (links[title]?.redirect_to) {
              link =
                links[link].redirect_to +
                (links[link].section ? "#" + links[link].section : "");
            }
          }
        }
        return `<a href="${encodeURI(link)}">${text}</a>`;
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
