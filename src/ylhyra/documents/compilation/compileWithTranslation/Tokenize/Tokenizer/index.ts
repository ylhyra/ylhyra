import sentenceTokenizer from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/Tokenizer/sentenceTokenizer";
import wordTokenizer from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/Tokenizer/wordTokenizer";
import {
  RawParagraphsWithHash,
  RawTokenizedParagraphs,
} from "ylhyra/documents/types/various";

export function tokenizer(
  paragraphs: RawParagraphsWithHash
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
