import { TranslationItemList } from "ylhyra/documents/types/types";
import { TokenizedParagraphs } from "ylhyra/documents/types/various";

/**
 * A helper list.
 * This list is created when INITIALIZE_WITH_TOKENIZED_AND_DATA is called.
 */
export default (paragraphs: TokenizedParagraphs): TranslationItemList => {
  let arrayOfAllWordIDs: TranslationItemList["arrayOfAllWordIDs"] = [];

  paragraphs &&
    paragraphs.forEach((paragraph) => {
      paragraph.sentences.forEach((sentence) => {
        sentence.words.forEach((word) => {
          if (typeof word !== "string" && word.id) {
            arrayOfAllWordIDs.push(word.id);
          }
        });
      });
    });

  if (!paragraphs) {
    console.error('Missing "paragraphs" in List.js"');
  }

  return {
    arrayOfAllWordIDs,
  };
};
