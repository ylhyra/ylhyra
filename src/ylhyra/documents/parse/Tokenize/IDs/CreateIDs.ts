import hash from "modules/hash";
import shortid from "shortid";
import {
  RawTokenizedParagraphs,
  TokenizedParagraphsWithIds,
} from "ylhyra/documents/parse/types";

export const wordRegex = /[A-zÀ-ÿ0-9]/;

const CreateIDs = (
  documentTitle: string,
  paragraphs: RawTokenizedParagraphs
): TokenizedParagraphsWithIds => {
  const seed = hash(shortid.generate() + "" + documentTitle).slice(0, 4);
  let i = 0;
  const makeID = () => {
    return `${seed}${i++}`;
  };

  return paragraphs.map((paragraph) => {
    /*
      Paragraph
    */
    return {
      index: paragraph.index,
      hash: paragraph.hash,
      sentences: paragraph.sentences.map((sentence) => {
        /*
          Sentence
        */
        const sentenceText = getTextFromTokenized(sentence).trim();
        const sentenceId = makeID();
        return {
          id: "s_" + sentenceId,
          text: sentenceText,
          words: sentence
            .map((word) => {
              /*
                Word
              */
              const wordText = getTextFromTokenized(word).trim();
              if (!wordRegex.test(wordText)) return word;
              const wordId = makeID();
              return {
                id: "w_" + wordId,
                text: wordText,
              };
            })
            // Filter out empty ends
            .filter((word, index) => {
              const isAtEnd = index === 0 || index === sentence.length - 1;
              const isEmpty = !(typeof word === "string"
                ? word.trim()
                : word.text?.trim());
              return isAtEnd && isEmpty;
            }),
        };
      }),
    };
  });
};

export default CreateIDs;

/*
  Gets text from tokenized output
*/
export const getTextFromTokenized = (t) => {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join("");
  }
  if (typeof t === "object") {
    return t.text;
  }
  return t;
};
