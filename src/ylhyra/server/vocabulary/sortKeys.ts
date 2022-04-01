import { TermId } from "ylhyra/app/vocabulary/actions/card/types";
import generateHtml from "ylhyra/documents/compile";
import { decodeDataInHtml } from "ylhyra/documents/compile/functions/functions";

/**
 * Read the page "Course" and find the order of its vocabulary list
 */
export default async function getSortKeysBasedOnWhenWordIsIntroducedInTheCourse(
  getRawSentences?: Boolean
) {
  if (process.env.DECK) return {};
  const { content } = await generateHtml("course");
  let i = 1;
  let sortKeys: { [termId: TermId]: number } = {}; /* Term to sortKey */
  let sentences = {};
  content.replace(/data="([^"]+?)"/g, (x: string, data: string) => {
    const v = decodeDataInHtml(data);
    if (!v) return "";
    v.terms.forEach((termId: TermId) => {
      if (!(termId in sortKeys)) {
        sortKeys[termId] = i;
        i++;
      }
    });
    return "";
  });
  console.log(`${i} terms in course`);
  if (getRawSentences) return sentences;
  return sortKeys;
}
