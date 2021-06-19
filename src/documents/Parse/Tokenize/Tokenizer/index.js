import sentence_tokenizer from "./sentence-tokenizer";
import word_tokenizer from "./word-tokenizer";

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
