import sentenceTokenizer from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/Tokenizer/sentenceTokenizer";
import wordTokenizer from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/Tokenizer/wordTokenizer";
import {
  ParagraphsWithHash,
  RawTokenizedParagraphs,
} from "ylhyra/documents/types";

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
