import { getDescriptionFromGrammaticalTag } from "inflection/tables/classification/classification";
import { ucfirst } from "ylhyra/app/app/functions/ucfirst";
import { formatUrl } from "ylhyra/server/content/links/paths";

/**
 * Creates a link from our labels to the relevant Ylhýra pages
 */
export default (link: string, label?: string) => {
  if (!link || typeof link !== "string") return "";
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return "";
  }

  /* Retrieve additional info from "classification.js" file */
  const info = getDescriptionFromGrammaticalTag(link, false);
  if (info) {
    if (info.has_article_on_ylhyra) {
      link = info.title;
    } else {
      /* Link does not exist */
      return label;
    }
  }

  /* Link does not exist */
  if (missing_links.includes(link)) {
    return label;
  }

  const url = "https://ylhyra.is" + encodeURI(formatUrl(link));
  return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`;
};

export const removeLinks = (string: string) => {
  return string?.replace(/<\/a>/g, "").replace(/<a .+?>/g, "");
};

export const stripHTML = (string: string) => {
  return (
    string &&
    string
      .replace(/<\/[a-z]+>/g, "")
      .replace(/<[a-z]+ ?([^>]+)?>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
};

export const ucfirst_link = (input: string) =>
  input.replace(/^(?:<a .+?>)?(.)/, (part) => {
    let split = part.split("");
    split[split.length - 1] = ucfirst(split[split.length - 1]);
    return split.join("");
  });

let missing_links = [
  "irregular inflection",
  "includes a sound change",
  "regular inflection",
  "strongly conjugated",
  "weakly conjugated",
  "helper words for the article",
];
