/**
- Groups paragraphs together
- Then sends these grouped paragraphs to the inputted "paragraphCallback".
- Returns a JSON tree of the entire document.
*/
import { HtmlAsJson } from "app/app/functions/html2json/types";
import lastInArray from "app/app/functions/lastInArray";
import { newTitle } from "documents/parse/ExtractData";

/** TODO! This should not be global!! */
let documents: string[] = [];

/**
  - Finds paragraphs of text.
  - Groups sequences of text and inline elements together.
  - This allows us to split sentences without giving a thought about how HTML tags affect it.
  - Block elements make us switch to a new paragraph.

  Note:
  - WrapInTags relies on returns, while ExtractText does not
*/
const groupParagraphs = ({
  input,
  getNewTitle,
  isTranslating,
  paragraphCallback,
}: {
  input: HtmlAsJson;
  getNewTitle: newTitle;
  isTranslating?: Boolean;
  paragraphCallback: (
    group: HtmlAsJson[],
    documentTitle: string
  ) => HtmlAsJson[] | undefined;
}): HtmlAsJson => {
  if (!input || shouldSkip(input)) return input;
  if (input.child) {
    /*
      Look for inline elements & text.
      We group together inline elements before splitting into
      sentences so that "Blah <i>blah</i> blah." will be assessed together.
    */
    let returns: HtmlAsJson[] = [];
    let group: HtmlAsJson[] = [];
    for (let i = 0; i < input.child.length; i++) {
      let isNewDocument = false;

      const element = input.child[i];
      if (shouldSkip(element)) {
        returns.push(element);
        continue;
      }
      const shouldTranslate = fnShouldTranslate(element, isTranslating);

      if (element.attr) {
        if (element.attr["data-document-start"]) {
          documents.push(getNewTitle.get(element.attr["data-document-start"]));
          isNewDocument = true;
        } else if (element.attr["data-document-end"] && documents.length > 0) {
          documents.pop();
          isNewDocument = true;
        }
      }

      /*
        If we see an inline element or text, we group
        it together before sending to sentence()
      */
      if (
        isTranslating &&
        shouldTranslate &&
        (isInlineElement(element.tag) || element.node === "text") &&
        !isNewDocument
      ) {
        group.push(element);
      } else {
        /*
          Else, our grouping is finished
        */
        returns = [
          ...returns,
          /* Todo: Very confusing spaghetti-code callback */
          ...(isTranslating
            ? paragraphCallback(group, lastInArray(documents)) || []
            : group),
          groupParagraphs({
            input: element,
            paragraphCallback,
            isTranslating: shouldTranslate,
            getNewTitle,
          }) || {},
        ];
        group = [];
      }
    }
    return {
      ...input,
      child: [
        ...returns,
        /* Todo: Very confusing spaghetti-code callback */
        ...(isTranslating
          ? paragraphCallback(group, lastInArray(documents)) || []
          : group),
      ],
    };
  }
  return input;
};

export const fnShouldTranslate = (
  { tag, attr }: Partial<HtmlAsJson>,
  isTranslating?: Boolean
) => {
  if (tag && ["translate", "book"].includes(tag.toLowerCase())) {
    return true;
  }
  if (
    attr &&
    (attr["data-translate"] === "no" || attr["data-translate"] === "false")
  ) {
    return false;
  }
  if (tag === "notranslate") {
    return false;
  }
  if (attr && attr["data-children"] === "string") {
    return false;
  }
  if (attr && "data-translate" in attr && attr["data-translate"] !== "no") {
    return true;
  }
  if (
    attr &&
    ("no-translate" in attr || "data-no-translate" in attr || "ignore" in attr)
  ) {
    return false;
  }
  return isTranslating;
};

export const isInlineElement = (tag: string) => {
  if (!tag || typeof tag !== "string") {
    return false;
  }
  return [
    "span",
    "b",
    "big",
    "i",
    "small",
    "tt",
    "abbr",
    "acronym",
    "cite",
    "code",
    "dfn",
    "em",
    "kbd",
    "strong",
    "samp",
    "var",
    "a",
    "bdo",
    "map",
    "object",
    "q",
    "sub",
    "sup",
  ].includes(tag.toLowerCase());
};

/* Block elements to skip */
export const shouldSkip = ({ tag, attr }: HtmlAsJson) => {
  if (!tag) {
    return false;
  }
  if (attr?.class === "instructions" || tag === "answers") {
    return true;
  }
  return ["script", "style", "head" /* 'sup'*/].includes(tag.toLowerCase());
};

export default groupParagraphs;
