/*
  Todo:
  It is most often unnecessary to use "Words" and "Sentences",
  we should instead only rely on the more general "Items".
*/
import { ListData } from "documents/parse/types";

export default (paragraphs): ListData => {
  let items = {};
  let arrayOfAllItemIDs = [];
  let sentences = {};
  let words = {};
  let arrayOfAllWordIDs = [];

  paragraphs &&
    paragraphs.forEach((paragraph) => {
      paragraph.sentences.forEach((sentence) => {
        sentences[sentence.id] = sentence;
        items[sentence.id] = sentence;
        arrayOfAllItemIDs.push(sentence.id);
        sentence.words.forEach((word) => {
          if (word.id) {
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
