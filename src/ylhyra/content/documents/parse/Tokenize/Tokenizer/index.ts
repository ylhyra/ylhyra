import sentenceTokenizer from "ylhyra/content/documents/parse/Tokenize/Tokenizer/sentenceTokenizer";
import wordTokenizer from "ylhyra/content/documents/parse/Tokenize/Tokenizer/wordTokenizer";
import {
  ParagraphsWithHash,
  RawTokenizedParagraphs,
} from "ylhyra/content/documents/parse/types";

export default function Tokenize(
  paragraphs: ParagraphsWithHash
): RawTokenizedParagraphs {
  return paragraphs.map(({ hash, text }) => {
    return {
      hash,
      sentences: sentenceTokenizer(text).map((sentence) => {
        return wordTokenizer(sentence);
      }),
    };
  });
}
