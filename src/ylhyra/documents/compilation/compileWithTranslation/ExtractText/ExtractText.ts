import emoji_strip from "emoji-strip";
import hash from "modules/hash";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { newTitle } from "ylhyra/documents/compilation/compileWithTranslation/ExtractData";
import groupParagraphs from "ylhyra/documents/compilation/compileWithTranslation/ExtractText/Paragraphs";
import { DocumentTitleToRawParagraphs } from "ylhyra/documents/types/various";

/**
  Convert document into raw text.

  1. Parses input
  2. Splits into paragraphs
  3. Gets raw text
  4. Returns a list of paragraphs (text & hash)
 */
export default function (json: HtmlAsJson): DocumentTitleToRawParagraphs {
  let paragraphs: Array<{
    index: number;
    documentTitle: string;
    hash: string;
    text: string;
  }> = [];

  let index = 0;
  groupParagraphs({
    input: json,
    getNewTitle: new newTitle(),
    paragraphCallback: (paragraph, documentTitle) => {
      if (documentTitle === undefined) {
        return;
      }
      const text = getTextFromJson(paragraph, true, true);
      if (text) {
        paragraphs.push({
          index: index++,
          documentTitle: documentTitle || "untitled",
          hash: hash(text),
          text: text,
        });
      }
    },
  });

  /*
    Sort paragraphs into each document
   */
  let documents = {};
  paragraphs.forEach(({ documentTitle, ...paragraph }) => {
    if (!documents[documentTitle]) {
      documents[documentTitle] = [];
    }
    documents[documentTitle].push(paragraph);
  });
  return documents;
}

/*
  Turns a JSON representation of HTML into raw text
*/
export const getTextFromJson = (
  json: HtmlAsJson | HtmlAsJson[],
  clean = false,
  trim = false
): string => {
  const _traverse = (input: HtmlAsJson | HtmlAsJson[]) => {
    if (typeof input === "string") {
      return input;
    }
    if (Array.isArray(input)) {
      return input
        .map((i) => {
          if (shouldIgnore(i)) return " ";
          return _traverse(i);
        })
        .join("");
    }
    if (input.node === "text") {
      return input.text;
    }
    if (input.child) {
      return input.child
        .map((i) => {
          if (shouldIgnore(i)) return " ";
          return _traverse(i);
        })
        .join("");
    }
    return "";
  };
  const cleanText = (input) => {
    return input.replace(IgnoredCharacters, "").replace(/[\s]+/gm, " ");
  };
  let returns = _traverse(json);
  if (clean) {
    returns = emoji_strip(cleanText(returns));
  }
  if (trim) {
    returns = returns
      .replace(/{+.+?}+/g, "") // Removes text in brackets, like "{kvk}"
      .replace(/[\s]+/gm, " ")
      .trim();
  }
  return returns;
};

/*
  1. soft hyphen
*/
const IgnoredCharacters = /\u00AD/g;

const shouldIgnore = (i) => {
  if (i.tag === "sup") return true;
  return i.attr && (i.attr["data-not-text"] || i.attr["data-children"]);
};
