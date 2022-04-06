import generateHtml from "ylhyra/content/documents/compileDocument";
import { decodeDataInHtml } from "ylhyra/content/documents/compileDocument/functions/functions";
import { TermId } from "ylhyra/vocabulary/types";

export type SortKeys = { [termId: TermId]: number };
/**
 * Read the page "Course" and find the order of its vocabulary list
 */
export async function getSortKeysBasedOnWhenWordIsIntroducedInTheCourse(): Promise<SortKeys> {
  if (process.env.DECK) return {};
  const { content } = await generateHtml("course");
  let i = 1;
  let sortKeys: SortKeys = {}; /* Term to sortKey */
  // let sentences = {};
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
  // if (getRawSentences) return sentences;
  return sortKeys;
}
