/*

 __        __                  _          _
 \ \      / / __ __ _ _ __    (_)_ __    | |_ __ _  __ _ ___
  \ \ /\ / / '__/ _` | '_ \   | | '_ \   | __/ _` |/ _` / __|
   \ V  V /| | | (_| | |_) |  | | | | |  | || (_| | (_| \__ \
    \_/\_/ |_|  \__,_| .__/   |_|_| |_|   \__\__,_|\__, |___/
                     |_|                           |___/

 1. Parses input
 2. Loops over tokenization
 3. Merges tokenization and HTML to produce <sentence/> and <word/> tags

---

  We split up Words and Sentences based on raw text, not based on HTML structure.

  The purpose of these functions is to turn this HTML:
      <b>Blabla bla! <i>Bla</i></b> bla bla.
  Into:
      <sentence>
        <b>Blabla bla!</b>
      </sentence>
      <sentence>
        <b><i>Bla</i></b> bla bla.
      </sentence>

  That is to say, it breaks out of HTML tags at the correct spots in
  order to encapsulate the text into <sentence/> tags.

*/
import { HtmlAsJson } from "app/app/functions/html2json/types";
import { newTitle } from "documents/parse/ExtractData";
import { getTextFromJson } from "documents/parse/ExtractText/ExtractText";
import groupParagraphs from "documents/parse/ExtractText/Paragraphs";
import {
  DocumentTitleToTokenizedParagraphsWithIds,
  TokenizedFlattenedForWrapInTags,
  TokenizedParagraphWithIds,
} from "documents/parse/types";

import InsertSplit from "documents/parse/WrapInTags/1-InsertSplit";
import SplitAndWrap from "documents/parse/WrapInTags/2-SplitAndWrap";
import InvertElementsThatOnlyContainOneThing from "documents/parse/WrapInTags/3-Invert";
import MergeElementsThatHaveBeenSplitUnnecessarily from "documents/parse/WrapInTags/4-Merge";

/*
  Parse input and split paragraphs
*/
export default function (
  json: HtmlAsJson,
  tokenized: DocumentTitleToTokenizedParagraphsWithIds
): HtmlAsJson {
  /*
    Flatten tokenized
  */
  let tokenizedFlattened: TokenizedFlattenedForWrapInTags = [];
  for (const documentTitle of Object.keys(tokenized)) {
    for (const i of Object.keys(tokenized[documentTitle])) {
      if (!tokenized[documentTitle].hasOwnProperty(i)) continue;
      tokenizedFlattened.push({
        documentTitle,
        ...tokenized[documentTitle][i],
      });
    }
  }
  tokenizedFlattened = tokenizedFlattened.sort((a, b) => a.index - b.index);

  let index = 0;
  let wrapped: HtmlAsJson = groupParagraphs({
    input: json,
    getNewTitle: new newTitle(),
    paragraphCallback: (paragraph, documentTitle) => {
      const text = getTextFromJson(paragraph, true, true);
      if (documentTitle === undefined) {
        return paragraph;
      }
      if (text) {
        return Sentences(paragraph, tokenizedFlattened[index++].sentences);
      }
      return paragraph;
    },
  });
  wrapped = removeInlineData(wrapped);

  return wrapped;
}

/*
  Extract sentences from paragraph
*/
const Sentences = (
  paragraph_HTML: HtmlAsJson,
  sentences: TokenizedParagraphWithIds["sentences"]
): HtmlAsJson => {
  /*
    Extract words from sentence
    (Creates a function that will be called in "WrapInTags.js")
  */
  let i = 0;

  function Words(sentence_HTML: HtmlAsJson) {
    const words = sentences[i++].words;
    return WrapInTags(sentence_HTML, words, "word");
  }

  /* TODO!!! Verify, this previously returned x.child!! */
  return WrapInTags(paragraph_HTML, sentences, "sentence", Words);
};

const WrapInTags = (
  input: HtmlAsJson,
  tokenizedSplit:
    | TokenizedParagraphWithIds["sentences"]
    | TokenizedParagraphWithIds["sentences"][number]["words"],
  elementName: "sentence" | "word",
  innerFunction?: Function
): HtmlAsJson => {
  const tempAttributeName = innerFunction ? `data-temp-id` : `data-temp-id2`;

  if (!tokenizedSplit || tokenizedSplit.length === 0) {
    console.log("Empty tokenizedSplit");
    return input; // { child: input };
  }
  const html: string = InsertSplit(input, tokenizedSplit);
  let json: HtmlAsJson = SplitAndWrap(
    html,
    tokenizedSplit,
    elementName,
    innerFunction,
    tempAttributeName
  );

  /* TODO: Þetta virkar ekki rétt, sjá "krók og kima" á http://localhost:3000/bl%C3%A6r/silfursvanurinn/3 */
  json = InvertElementsThatOnlyContainOneThing(json);
  json = MergeElementsThatHaveBeenSplitUnnecessarily(json, tempAttributeName);
  return json;
};

/*
  Removes the inline data printed in the "Start" template
*/
const removeInlineData = (input: HtmlAsJson): HtmlAsJson => {
  if (!input) return input;
  // if (Array.isArray(input)) {
  //   return input.map((j) => removeInlineData(j));
  // }
  const { node, attr, child } = input;
  if (node === "element" || node === "root") {
    if (attr && (attr["data-document-start"] || attr["data-document-end"])) {
      return { node: "text", text: "", tag: "", attr: {} }; // Hlýtur að vera til betri leið til að henda út greinum...
    }
    if (child) {
      return {
        ...input,
        child: child.map((item) => removeInlineData(item)),
      };
    }
    return input;
  }
  return input;
};
