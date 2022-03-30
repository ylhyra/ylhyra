import { URL_title } from "app/app/paths";
import { app_urls } from "app/router/appUrls";
import { getValuesForURL } from "server/content/links";

export const ProcessLinks = (input: string) => {
  return (
    input
      /* Internal links */
      .replace(
        /\[\[(.+?)\]\]([a-záéíúóðþýöæ]+)?/gi,
        (x: string, match: string, after: string) => {
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
            const [inputUrl, inputSection] = link.split("#");
            let values = getValuesForURL(inputUrl);

            if (!(inputUrl in app_urls) && !values?.shouldBeCreated) {
              return text;
            }

            let url = encodeURI(values.url || inputUrl /*For appurls*/);
            let section = values.section || inputSection;
            if (section) {
              url += "#" + encodeURI(section);
            }

            return `<a href="${url}">${text}</a>`;
          }
        }
      )
      /* Bare external links */
      .replace(/\[((?:http|mailto)[^ ]+?)\]/g, (x: string, url: string) => {
        return `&#91;<a href="${url}">link</a>&#93;`;
      })
      /* External links */
      .replace(
        /\[((?:http|mailto)[^ ]+?) (.+?)\]/g,
        (x: string, url: string, text: string) => {
          return `<a href="${url}">${text}</a>`;
        }
      )
  );
};
