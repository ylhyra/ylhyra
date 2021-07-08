import { URL_title, section_id } from "paths.js";

export const ProcessLinks = (input, links) => {
  return (
    input
      /* Internal links */
      .replace(/\[\[(.+?)\]\]/g, (x, match) => {
        let [link, target] = match.split("|");
        link = link.trim();
        target = (target || link).trim();
        if (/^:?w:/i.test(link)) {
          link = `http://en.wikipedia.org/wiki/${encodeURIComponent(
            link.replace(/^w:/i, "")
          )}`;
        } else {
          link = URL_title(link);
          const [title, section] = link.split("#");
          if (links) {
            if (title && !(title in links)) {
              return target;
            }
            if (links[title].redirect_to) {
              link =
                links[link].redirect_to +
                (links[link].section ? "#" + links[link].section : "");
            }
          }
          if (title) {
            link = "/" + link;
          }
        }
        return `<a href="${encodeURI(link)}">${target}</a>`;
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
