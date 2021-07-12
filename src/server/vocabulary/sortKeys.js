import atob from "atob";
import generate_html from "documents/Compile";
import {
  getHash,
  GetLowercaseStringForAudioKey,
} from "app/VocabularyMaker/functions";

export default async (getRawSentences) => {
  /****************
   * Read the page "Course" and find the order of its vocabulary list
   ***************/
  const { content, header } = await generate_html("course");
  let i = 1;
  let sortKeys = {}; /* Term to sortKey */
  let sentences = {};
  content.replace(/header_data="(.+?)"/g, (x, data) => {
    const values = JSON.parse(decodeURIComponent(atob(data)));
    if (!values) return;
    values.forEach((value) => {
      value = value.split(" = ")[0];
      const hash = getHash(value);
      if (!(hash in sortKeys)) {
        sortKeys[hash] = i;
        if (getRawSentences) {
          sentences[GetLowercaseStringForAudioKey(value)] = i;
        }
        i++;
      }
    });
  });
  console.log(`${i} terms in course`);
  if (getRawSentences) return sentences;
  return sortKeys;
};
