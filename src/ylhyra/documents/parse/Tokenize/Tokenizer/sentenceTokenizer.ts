/**
  Attempts to split paragraphs into sentences of roughly 50 characters.
*/

import r from "xregexp";

const startOfSentence = '(?:\\p{Uppercase letter}|[„"¿(])';
const endOfSentence = '[.!?;]+?(?:[“")])? ';

export default (input: string): string[] => {
  return (
    input
      // Split on new sentences
      .replace(r(`(${endOfSentence})(${startOfSentence})`, "g"), "$1\n\n$2")

      // Remove splits inside parentheses
      .replace(r(`(\\(.*?)\n\n(.*?\\))`, "g"), "$1$2")

      // Split in the middle of sentences (if preceded by at least 20 characters)
      .replace(r(`([^.,;:?!"”]{20,}[,:] )([^.,;:?!"”]{20,})`, "g"), "$1\n\n$2")

      .split(/\n\n+/g)
      .filter(Boolean)
  );
};
