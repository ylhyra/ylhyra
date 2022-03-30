import { json2html } from "app/app/functions/html2json";
import { HtmlAsJson } from "app/app/functions/html2json/types";
import { ArrayOfEitherSentencesOrWords } from "documents/parse/types";
// import SplitIntoUnicodeCharacters from './helpers/runes'
// import { getTextFromTokenized } from 'server/api/translate/tokenizer/create-ids'

export const TEMPORARY_SPLIT_MARKER = "{{SPLIT HERE}}";

/*
  STEP 1:

  Adds "{{SPLIT HERE}}" in the tree
*/

export default function (
  input: HtmlAsJson[],
  tokenizedSplit: ArrayOfEitherSentencesOrWords
): string {
  // Turn tokenized data into an array of text
  const array = tokenizedSplit.map(getTextFromTokenized);

  let currentIndex = 0;
  let locationInString = 0;
  const insertTemporarySplitMarker = (i: HtmlAsJson): HtmlAsJson => {
    const { node, child, text } = i;
    if (node === "element" || node === "root") {
      return {
        ...i,
        child: child?.map((x) => insertTemporarySplitMarker(x)),
      };
    } else if (node === "text") {
      /**
        Split text into individual characters
      */
      return {
        ...i,
        text: text
          ?.split("")
          .map((character) => {
            /**
              Surrounding spaces and characters like soft hyphens
              may have been stripped away.
              Here we just return characters until we see the one we are looking for.
            */
            if (character !== array[currentIndex][locationInString]) {
              return character;
            }

            /**
              When we have finished looping through each character in the current array string
              we insert a delimiter, here the text "{{SPLIT HERE}}".
              (Assumes empty strings have been filtered out)
            */
            if (
              locationInString + character.length ===
                array[currentIndex].length &&
              currentIndex + 1 < array.length
            ) {
              locationInString = 0;
              currentIndex++;
              return character + TEMPORARY_SPLIT_MARKER;
            } else {
              locationInString += character.length;
              return character;
            }
          })
          .join(""),
      };
    }
    return i;
  };

  /*
    Turns the JSON into a HTML string
    (which includes "{{SPLIT HERE}}" in the correct places)
  */
  const html = json2html({
    node: "root",
    child: input.map((x) => insertTemporarySplitMarker(x)),
  });

  return html;
}

export const getTextFromTokenized = (
  t: ArrayOfEitherSentencesOrWords[number]
): string => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join("");
  }
  if (typeof t === "object") {
    return t.text;
  }
  return t;
};
