import { removeComments } from "documents/compile/functions/functions";
import { getPlaintextFromVocabularyEntry } from "maker/vocabulary_maker/functions";
const yaml = require("js-yaml");

export const ParseHeaderAndBody = (data, file) => {
  data = removeComments(data);
  const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
  if (!match) {
    console.warn("Failed to parse\n\n" + data);
    return {};
  }
  let [, header, body] = match;

  // header = header.replace(/: (.+):/g, ': $1\\:')
  header = yaml.load(header);
  body = (body || "").trim();

  if (!header.title && header.title !== "") {
    throw new Error("Missing title\n\n" + data);
    return;
  }

  if (!header.level && /\/[abc][123]\//i.test(file)) {
    header.level = file.match(/\/([abc][123])\//i)[1].toUpperCase();
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
