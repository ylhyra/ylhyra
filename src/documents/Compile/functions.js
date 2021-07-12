import { URL_title, section_id } from "paths.js";
import { removeComments } from "documents/Compile/transclude";
const yaml = require("js-yaml");

export const ParseHeaderAndBody = (data, file) => {
  data = removeComments(data);
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
  if (!match) {
    throw new Error("Failed to parse\n\n" + data);
    return;
  }
  let [j, header, body] = match;

  let output = {};
  // header = header.replace(/: (.+):/g, ': $1\\:')
  header = yaml.load(header);
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + data);
    return;
  }

  if (!header.level && /\/[abc][123]\//i.test(file)) {
    header.level = file.match(/\/([abc][123])\//i)[1].toUpperCase();
  }

  body.replace(/<vocabulary>(.+?)<\/vocabulary>/g, (x, voc) => {
    header.vocabulary = voc.split(/\n/g).filter(Boolean);
    return "";
  });

  return { header, body };
};

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
