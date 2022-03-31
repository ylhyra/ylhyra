import { removeComments } from "ylhyra/documents/compile/functions/functions";
import { getPlaintextFromVocabularyEntry } from "ylhyra/maker/vocabulary_maker/compile/format";

const yaml = require("js-yaml");

export type HeaderData = {
  "title": string;
  "level"?: string;
  "license"?: string;
  "vocabulary"?: string[];
  "redirects"?: string[];
  "published"?: boolean;
  "typos fixed"?: boolean;
  /** Added later */
  "has_data"?: Boolean;
  "reflist"?: string;
  "classes"?: string[];
};

export const ParseHeaderAndBody = (
  data: string,
  file: string
): { header: HeaderData; body: string } => {
  data = removeComments(data);
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
  if (!match) {
    throw new Error("Failed to parse\n\n" + data);
  }
  let [, _header, body] = match;

  const header: HeaderData = yaml.load(_header);
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + data);
  }

  if (!header.level && /\/[abc][123]\//i.test(file)) {
    header.level = file.match(/\/([abc][123])\//i)?.[1].toUpperCase();
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
