import { TranslationItemList } from "ylhyra/documents/types/types";
import { TokenizedParagraphs } from "ylhyra/documents/types/various";

/**
 * A helper list.
 * This list is created when INITIALIZE_WITH_TOKENIZED_AND_DATA is called.
 */
export default (paragraphs: TokenizedParagraphs): TranslationItemList => {
  let sentences: TranslationItemList["sentences"] = {};
  let words: TranslationItemList["words"] = {};
  let arrayOfAllWordIDs: TranslationItemList["arrayOfAllWordIDs"] = [];

  paragraphs &&
    paragraphs.forEach((paragraph) => {
      paragraph.sentences.forEach((sentence) => {
        sentences[sentence.id] = sentence;
        sentence.words.forEach((word) => {
          if (typeof word !== "string" && word.id) {
            word = {
              ...word,
              belongsToSentence: sentence.id,
            };
            words[word.id] = word;
            arrayOfAllWordIDs.push(word.id);
          }
        });
      });
    });

  if (!paragraphs) {
    console.error('Missing "paragraphs" in List.js"');
  }

  return {
    sentences,
    words,
    arrayOfAllWordIDs,
  };
};
