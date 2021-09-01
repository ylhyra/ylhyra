import generate_html from "documents/compile";
import { DecodeDataInHTML } from "documents/compile/functions/functions";

export default async (getRawSentences) => {
  if (process.env.DECK) return {};
  /****************
   * Read the page "Course" and find the order of its vocabulary list
   ***************/
  const { content } = await generate_html("course");
  let i = 1;
  let sortKeys = {}; /* Term to sortKey */
  let sentences = {};
  content.replace(/data="(.+?)"/g, (x, data) => {
    const v = DecodeDataInHTML(data);
    if (!v) return;
    v.terms.forEach((term_id) => {
      if (!(term_id in sortKeys)) {
        sortKeys[term_id] = i;
        // if (getRawSentences) {
        //   sentences[GetLowercaseStringForAudioKey(value)] = i;
        // }
        i++;
      }
    });
    // values.forEach((value) => {
    //   value = value.split(" = ")[0];
    //   const hash = getHash(value);
    //   if (!(hash in sortKeys)) {
    //     sortKeys[hash] = i;
    //     if (getRawSentences) {
    //       sentences[GetLowercaseStringForAudioKey(value)] = i;
    //     }
    //     i++;
    //   }
    // });
  });
  console.log(`${i} terms in course`);
  if (getRawSentences) return sentences;
  return sortKeys;
};
