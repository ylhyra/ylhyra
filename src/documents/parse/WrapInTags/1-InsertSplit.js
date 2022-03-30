"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextFromTokenized = void 0;
const html2json_1 = require("app/app/functions/html2json");
// import SplitIntoUnicodeCharacters from './helpers/runes'
// import { getTextFromTokenized } from 'server/api/translate/tokenizer/create-ids'
/*
  STEP 1:

  Adds "{{SPLIT HERE}}" in the tree
*/
function default_1(input, tokenizedSplit) {
    // Turn tokenized data into an array of text
    const array = tokenizedSplit.map(exports.getTextFromTokenized);
    // console.warn(split)
    let currentIndex = 0;
    let locationInString = 0;
    const InsertSPLIT = (i) => {
        if (Array.isArray(i)) {
            return i.map((x) => InsertSPLIT(x));
        }
        else {
            const { node, child, text } = i;
            if (node === "element" || node === "root") {
                return Object.assign(Object.assign({}, i), { child: child === null || child === void 0 ? void 0 : child.map((x) => InsertSPLIT(x)) });
            }
            else if (node === "text") {
                /*
                  Split text into individual characters
                */
                return Object.assign(Object.assign({}, i), { text: text
                        .split("")
                        .map((character) => {
                        /*
                          Surrounding spaces and characters like soft hyphens
                          may have been stripped away.
                          Here we just return characters until we see the one we are looking for.
                        */
                        if (character !== array[currentIndex][locationInString]) {
                            return character;
                        }
                        /*
                          When we have finished looping through each character in the current array string
                          we insert a delimiter, here the text "{{SPLIT HERE}}".
                          (Assumes empty strings have been filtered out)
                        */
                        if (locationInString + character.length ===
                            array[currentIndex].length &&
                            currentIndex + 1 < array.length) {
                            locationInString = 0;
                            currentIndex++;
                            return character + "{{SPLIT HERE}}";
                        }
                        else {
                            locationInString += character.length;
                            return character;
                        }
                    })
                        .join("") });
            }
            return i;
        }
    };
    /*
      Turns the JSON into a HTML string
      (which includes "{{SPLIT HERE}}" in the correct places)
    */
    const html = (0, html2json_1.json2html)({
        node: "root",
        child: InsertSPLIT(input),
    });
    // console.log(html);
    return html;
}
exports.default = default_1;
const getTextFromTokenized = (t) => {
    if (Array.isArray(t)) {
        return t.map(exports.getTextFromTokenized).join("");
    }
    if (typeof t === "object") {
        return t.text;
    }
    return t;
};
exports.getTextFromTokenized = getTextFromTokenized;
