"use strict";
/**

  Attempts to split Latin-script paragraphs into
  sentences of roughly 50 characters.

  It is preferable to do this with natural language processing.

  @returns An array of sentences


  // TODO! NOT DONE! Should be done through spans instead of Unicode whitespaces!
  To prevent an inter-sentence break, add &#8203; (zero width space)
  To force an inter-sentence break, add &#8232; (line separator) // TODO! NOT DONE

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xregexp_1 = __importDefault(require("xregexp"));
const startOfSentence = '(?:\\p{Uppercase letter}|[„"¿(])';
const endOfSentence = '[.!?;]+?(?:[“")])? ';
exports.default = (input) => {
    return (input
        // Split on new sentences
        .replace((0, xregexp_1.default)(`(${endOfSentence})(${startOfSentence})`, "g"), "$1\n\n$2")
        // Remove splits inside parantheses
        .replace((0, xregexp_1.default)(`(\\(.*?)\n\n(.*?\\))`, "g"), "$1$2")
        // // (I actually don't know why this is here, can probably be removed?)
        // .replace(r(`(\\(.{20,}\\)[.,;:?!"”] ?)`, 'g'), '\n\n$1\n\n')
        // Split in the middle of sentences (if preceded by at least 20 characters)
        .replace((0, xregexp_1.default)(`([^.,;:?!"”]{20,}[,:] )([^.,;:?!"”]{20,})`, "g"), "$1\n\n$2")
        // // Split spaces
        // .replace(/ \n\n/g, '\n\n \n\n')
        .split(/\n\n+/g)
        .filter(Boolean));
};
