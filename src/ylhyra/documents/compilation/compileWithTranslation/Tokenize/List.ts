import { TokenizedParagraphs } from "ylhyra/documents/types/various";

export const getArrayOfAllWordIDs = (
  paragraphs: TokenizedParagraphs
): string[] => {
  let arrayOfAllWordIDs: string[] = [];

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

  return arrayOfAllWordIDs;
};
