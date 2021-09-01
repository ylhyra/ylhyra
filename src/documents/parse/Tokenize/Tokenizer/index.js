import sentence_tokenizer from "documents/parse/Tokenize/Tokenizer/sentence-tokenizer";
import word_tokenizer from "documents/parse/Tokenize/Tokenizer/word-tokenizer";

const Tokenize = ({ paragraphs }) => {
  return paragraphs.map(({ hash, text }) => {
    return {
      hash,
      sentences: sentence_tokenizer(text).map((sentence) => {
        return word_tokenizer(sentence);
      }),
    };
  });
};

export default Tokenize;
