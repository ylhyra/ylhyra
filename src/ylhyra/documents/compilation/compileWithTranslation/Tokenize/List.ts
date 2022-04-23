import { TranslationList } from "ylhyra/documents/types/types";
import { TokenizedParagraphs } from "ylhyra/documents/types/various";

/**
 * Todo:
 * Is only called in a reducer, which is a very unclear place to put this.
 *
 * Todo?
 * It is most often unnecessary to use "Words" and "Sentences",
 * we could instead only rely on the more general "Items".
 */
export default (paragraphs: TokenizedParagraphs): TranslationList => {
  let items: TranslationList["items"] = {};
  let arrayOfAllItemIDs: TranslationList["arrayOfAllItemIDs"] = [];
  let sentences: TranslationList["sentences"] = {};
  let words: TranslationList["words"] = {};
  let arrayOfAllWordIDs: TranslationList["arrayOfAllWordIDs"] = [];

  paragraphs &&
    paragraphs.forEach((paragraph) => {
      paragraph.sentences.forEach((sentence) => {
        sentences[sentence.id] = sentence;
        items[sentence.id] = sentence;
        arrayOfAllItemIDs.push(sentence.id);
        sentence.words.forEach((word) => {
          if (typeof word !== "string" && word.id) {
            word = {
              ...word,
              belongsToSentence: sentence.id,
            };
            words[word.id] = word;
            items[word.id] = word;
            arrayOfAllWordIDs.push(word.id);
            arrayOfAllItemIDs.push(word.id);
          }
        });
      });
    });

  if (!paragraphs) {
    console.error('Missing "paragraphs" in List.js"');
  }

  return {
    items,
    arrayOfAllItemIDs,
    sentences,
    words,
    arrayOfAllWordIDs,
  };
};
