import { getDescriptionFromGrammaticalTag } from "inflection/tables/classification/classification";
import { uppercaseFirstLetter } from "modules/uppercaseFirstLetter";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";

/**
 * Creates a link from our labels to the relevant Ylhýra pages
 */
export default (link: string | null | undefined, label?: string) => {
  if (!link) return "";
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return "";
  }

  /* Retrieve additional info from "classification.ts" file */
  const description = getDescriptionFromGrammaticalTag(link, false);
  if (description) {
    if (description.has_article_on_ylhyra) {
      link = description.title;
    } else {
      /* Link does not exist */
      return label;
    }
  } else if (itemsMadeInInterfaceThatDontHaveLink.includes(link)) {
    return label;
  }

  const url = "https://ylhyra.is" + encodeURI(formatUrl(link));
  return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`;
};

export const uppercaseFirstLetterLink = (input: string) =>
  input.replace(/^(?:<a .+?>)?(.)/, (part: string) => {
    let split = part.split("");
    split[split.length - 1] = uppercaseFirstLetter(split[split.length - 1]);
    return split.join("");
  });

/** Items that do not exist in descriptionsList.ts but which were created in this interface that do not have a link */
/** TODO: Merge with descriptionsList.ts instead */
let itemsMadeInInterfaceThatDontHaveLink = [
  "irregular inflection",
  "includes a sound change",
  "regular inflection",
  "strongly conjugated",
  "weakly conjugated",
  "helper words for the article",
];
