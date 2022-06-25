import hash from "modules/hash";
import shortid from "shortid";
import {
  RawTokenizedParagraphs,
  TokenizedParagraphs,
  TokenizedSentence,
  TokenizedWord,
} from "ylhyra/documents/types/various";

export const wordRegex = /[A-zÀ-ÿ0-9]/;

export function CreateIDs(
  documentTitle: string,
  paragraphs: Array<
    TokenizedParagraphs[number] | RawTokenizedParagraphs[number]
  >
): TokenizedParagraphs {
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
        const words: TokenizedWord[] | string[] =
          "words" in sentence ? sentence.words : sentence;
        return {
          id: "s_" + sentenceId,
          text: sentenceText,
          words: words
            .map((word: TokenizedWord | string) => {
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
              const isAtEnd = index === 0 || index === words.length - 1;
              const isEmpty = !(typeof word === "string"
                ? word.trim()
                : word.text?.trim());
              return !(isAtEnd && isEmpty);
            }),
        };
      }),
    };
  });
}

export function getTextFromTokenized(
  t: TokenizedSentence | TokenizedWord | string[] | string
): string {
  if (Array.isArray(t)) {
    return t.map(getTextFromTokenized).join("");
  }
  if (typeof t === "object") {
    return t.text;
  }
  return t;
}
