import yaml from "js-yaml";
import { removeComments } from "ylhyra/documents/compile/functions/functions";
import { getPlaintextFromVocabularyEntry } from "ylhyra/maker/vocabulary_maker/compile/format";
import { promises as fs } from "fs";
import removeUnwantedCharacters from "modules/languageProcessing/removeUnwantedCharacters";

export type HeaderData = {
  "title": string;
  "level"?: string;
  "license"?: string;
  "vocabulary"?: string[];
  "redirects"?: string[];
  "published"?: boolean;
  "typos fixed"?: boolean;
  "classes"?: string[];
  "status"?: "draft";
  "index"?: "yes" | "no";
  /** Used when overwriting the default URL which is generated from the title of the page */
  "url"?: string;
  /** Added later */
  "has_data"?: Boolean;
  /** Added by References.ts in order to be printed in HeaderAndFooter.ts */
  "reflist"?: string;
};

export const readContentFile = async (
  filepath: string
): Promise<{ header: HeaderData; body: string }> => {
  let fileContents = await fs.readFile(filepath, "utf8");
  fileContents = removeComments(removeUnwantedCharacters(fileContents));
  const match = fileContents.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
  if (!match) {
    throw new Error("Failed to parse\n\n" + fileContents);
  }
  let [, _header, body] = match;

  const header = yaml.load(_header) as HeaderData;
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + fileContents);
  }

  if (!header.level && /\/[abc][123]\//i.test(filepath)) {
    header.level = filepath.match(/\/([abc][123])\//i)?.[1].toUpperCase();
  }

  if (!("license" in header) && header.title.startsWith("Course/")) {
    header.license = "CC0";
  }

  body = body.replace(/<vocabulary>([\s\S]+?)<\/vocabulary>/g, (x, voc) => {
    if (voc.trim().length > 0) {
      header.vocabulary = voc
        .split(/\n/g)
        .filter(Boolean)
        .map(getPlaintextFromVocabularyEntry);
    }
    return "";
  });

  return { header, body };
};
