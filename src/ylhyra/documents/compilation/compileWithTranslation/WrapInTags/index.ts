/**

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
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { newTitle } from "ylhyra/documents/compilation/compileWithTranslation/ExtractData";
import { getTextFromJson } from "ylhyra/documents/compilation/compileWithTranslation/ExtractText/ExtractText";
import groupParagraphs from "ylhyra/documents/compilation/compileWithTranslation/ExtractText/Paragraphs";
import InsertSplit from "ylhyra/documents/compilation/compileWithTranslation/WrapInTags/1-InsertSplit";
import SplitAndWrap from "ylhyra/documents/compilation/compileWithTranslation/WrapInTags/2-SplitAndWrap";
import InvertElementsThatOnlyContainOneThing from "ylhyra/documents/compilation/compileWithTranslation/WrapInTags/3-Invert";
import MergeElementsThatHaveBeenSplitUnnecessarily from "ylhyra/documents/compilation/compileWithTranslation/WrapInTags/4-Merge";
import {
  ArrayOfEitherTokenizedSentencesOrWords,
  DocumentTitleToTokenizedParagraphsWithIds,
  TokenizedFlattenedForWrapInTags,
  TokenizedParagraph,
} from "ylhyra/documents/types/various";

export default function (
  json: HtmlAsJson,
  tokenized: DocumentTitleToTokenizedParagraphsWithIds
): HtmlAsJson {
  /** By flattening, we can keep track of multiple transcluded documents. */
  let tokenizedFlattened: TokenizedFlattenedForWrapInTags = [];
  for (const documentTitle of Object.keys(tokenized)) {
    for (const paragraph of tokenized[documentTitle]) {
      tokenizedFlattened.push({
        documentTitle,
        ...paragraph,
      });
    }
  }
  tokenizedFlattened = tokenizedFlattened.sort((a, b) => a.index! - b.index!);

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
  wrapped = removeDocumentStartTags(wrapped);

  return wrapped;
}

/**
 * Extract sentences from paragraph
 */
const Sentences = (
  paragraph_HTML: HtmlAsJson[],
  sentences: TokenizedParagraph["sentences"]
): HtmlAsJson[] => {
  let i = 0;

  /*
    Extract words from sentence
    (Creates a function that will be called in "WrapInTags.js")
  */
  function Words(sentence_HTML: HtmlAsJson[]) {
    const words = sentences[i++].words;
    return WrapInTags(sentence_HTML, words, "word");
  }

  /* TODO!!! Verify, this previously returned x.child!! */
  return WrapInTags(paragraph_HTML, sentences, "sentence", Words);
};

const WrapInTags = (
  input: HtmlAsJson[],
  tokenizedSplit: ArrayOfEitherTokenizedSentencesOrWords,
  elementName: "sentence" | "word",
  innerFunction?: Function
): HtmlAsJson[] => {
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
  return [json];
};

/**
 * Removes the "data-document-start" span tags printed in Transclude.ts.
 * They also include translation data.
 */
const removeDocumentStartTags = (input: HtmlAsJson): HtmlAsJson => {
  if (!input) return input;
  const { node, attr, child } = input;
  if (node === "element" || node === "root") {
    if (attr && (attr["data-document-start"] || attr["data-document-end"])) {
      return { node: "text", text: "" };
    }
    if (child) {
      return {
        ...input,
        child: child.map((item) => removeDocumentStartTags(item)),
      };
    }
    return input;
  }
  return input;
};
