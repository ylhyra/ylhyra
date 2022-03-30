import r from "xregexp";

const startOfWord = "[A-zÀ-ÿ·-]";
const middleOfWord = "[A-zÀ-ÿ·\\-'’.,:0-9]";
const endOfWord = "[A-zÀ-ÿ·\\-']";

export const wordRegex = r(
  `((?:${startOfWord}(?:(?:${middleOfWord}+)?${endOfWord})?)|[0-9]+)`,
  "g"
);

export default (input: string): Array<string> => {
  return input.split(wordRegex).filter(Boolean);
};
