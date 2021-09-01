/*
   ____                    _            _
  |  _ \ __ ___      __   | |_ _____  _| |_
  | |_) / _` \ \ /\ / /   | __/ _ \ \/ / __|
  |  _ < (_| |\ V  V /    | ||  __/>  <| |_
  |_| \_\__,_| \_/\_/      \__\___/_/\_\\__|

  1. Parses input
  2. Splits into paragraphs
  3. Gets raw text
  4. Returns a list of paragraphs (text & hash)

*/

import GroupParagraphs from "./Paragraphs";
import hash from "app/app/functions/hash";
import emoji_strip from "emoji-strip";
import { newTitle } from "documents/parse";

/*
  Convert document into raw text
*/
export default function (json /*onlyRetrieveEntireDocuments*/) {
  let paragraphs = [];

  let index = 0;
  GroupParagraphs({
    input: json,
    getNewTitle: new newTitle(),
    paragraphFunction: (paragraph, documentTitle) => {
      const text = getText(paragraph, true, true);
      // console.log(text)
      // console.log(documentTitle)
      if (documentTitle === undefined) {
        // console.log(
        //   `Missing {{start}} for document which includes the text ${text}`
        // );
        return;
      }
      if (text) {
        paragraphs.push({
          index: index++,
          documentTitle: documentTitle || "untitled",
          hash: hash(text),
          text: text,
        });
        // console.log(index)
      }
    },
    // onlyRetrieveEntireDocuments
  });

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
export const getText = (data, clean = false, trim = false) => {
  // console.log(data)
  const getTextFromJson = (input) => {
    if (typeof input === "string") {
      return input;
    }
    if (input.node === "text") {
      return input.text;
    }
    if (input.child) {
      return input.child
        .map((i) => {
          if (shouldIgnore(i)) return " ";
          return getTextFromJson(i);
        })
        .join("");
    }
    if (Array.isArray(input)) {
      return input
        .map((i) => {
          if (shouldIgnore(i)) return " ";
          return getTextFromJson(i);
        })
        .join("");
    }
    return "";
  };
  const cleanText = (input) => {
    return input.replace(IgnoredCharacters, "").replace(/[\s]+/gm, " ");
  };
  let returns = getTextFromJson(data);
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
