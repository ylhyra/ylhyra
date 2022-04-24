import { promises as fs } from "fs";
import yaml from "js-yaml";
import removeUnwantedCharacters from "modules/languageProcessing/removeUnwantedCharacters";
import { removeComments } from "ylhyra/documents/compilation/compileDocument/functions/functions";
import { HeaderData } from "ylhyra/documents/compilation/compileDocument/types";
import { getPlaintextFromVocabularyEntry } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format";

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
