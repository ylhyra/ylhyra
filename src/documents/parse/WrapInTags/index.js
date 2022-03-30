"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*

 __        __                  _          _
 \ \      / / __ __ _ _ __    (_)_ __    | |_ __ _  __ _ ___
  \ \ /\ / / '__/ _` | '_ \   | | '_ \   | __/ _` |/ _` / __|
   \ V  V /| | | (_| | |_) |  | | | | |  | || (_| | (_| \__ \
    \_/\_/ |_|  \__,_| .__/   |_|_| |_|   \__\__,_|\__, |___/
                     |_|                           |___/

 1. Parses input
 2. Loops over tokenization
 3. Merges tokenization and HTML to produce <sentence/> and <word/> tags

---

  We split up Words and Sentences based on raw text, not based on HTML structure.

  The purpose of these functions is to turn this HTML:
      <b>Blabla bla! <i>Bla</i></b> bla bla.
  Into:
      <sentence>
        <b>Blabla bla!</b>
      </sentence>
      <sentence>
        <b><i>Bla</i></b> bla bla.
      </sentence>

  That is to say, it breaks out of HTML tags at the correct spots in
  order to encapsulate the text into <sentence/> tags.

*/
const parse_1 = require("documents/parse");
const ExtractText_1 = require("documents/parse/ExtractText/ExtractText");
const Paragraphs_1 = __importDefault(require("documents/parse/ExtractText/Paragraphs"));
const _1_InsertSplit_1 = __importDefault(require("documents/parse/WrapInTags/1-InsertSplit"));
const _2_SplitAndWrap_1 = __importDefault(require("documents/parse/WrapInTags/2-SplitAndWrap"));
const _3_Invert_1 = __importDefault(require("documents/parse/WrapInTags/3-Invert"));
const _4_Merge_1 = __importDefault(require("documents/parse/WrapInTags/4-Merge"));
/*
  Parse input and split paragraphs
*/
function default_1({ json, tokenized }) {
    // console.log(json2html(json))
    /*
      Flatten tokenized
    */
    let tokenizedFlattened = [];
    for (const documentTitle of Object.keys(tokenized)) {
        for (const i of Object.keys(tokenized[documentTitle])) {
            if (!tokenized[documentTitle].hasOwnProperty(i))
                continue;
            tokenizedFlattened.push(Object.assign({ documentTitle }, tokenized[documentTitle][i]));
        }
    }
    tokenizedFlattened = tokenizedFlattened.sort((a, b) => a.index - b.index);
    // console.log(JSON.stringify(tokenized, null, 2));
    // console.log(JSON.stringify(tokenizedFlattened, null, 2));
    // console.warn(JSON.stringify(json))
    let index = 0;
    let wrapped = (0, Paragraphs_1.default)({
        input: json,
        getNewTitle: new parse_1.newTitle(),
        paragraphFunction: (paragraph, documentTitle) => {
            const text = (0, ExtractText_1.getText)(paragraph, true, true);
            // console.log(JSON.stringify(paragraph))
            // console.log(text)
            if (documentTitle === undefined) {
                // console.log(JSON.stringify(paragraph))
                return paragraph;
            }
            if (text) {
                return Sentences(paragraph, tokenizedFlattened[index++].sentences);
            }
            return paragraph;
        },
    });
    wrapped = RemoveData(wrapped);
    // console.log(JSON.stringify(wrapped));
    // console.log(wrapped)
    // wrapped = html2json(json2html(wrapped))
    return wrapped;
}
exports.default = default_1;
/*
  Extract sentences from paragraph
*/
const Sentences = (paragraph_HTML, sentences) => {
    // console.warn('HAHA2')
    // console.log(JSON.stringify(paragraph_HTML));
    /*
      Extract words from sentence
      (Creates a function that will be called in "WrapInTags.js")
    */
    let i = 0;
    function Words(sentence_HTML) {
        const words = sentences[i++].words;
        return WrapInTags(sentence_HTML, words, "word");
    }
    return WrapInTags(paragraph_HTML, sentences, "sentence", Words).child;
};
const WrapInTags = (input, tokenizedSplit, elementName, innerFunction) => {
    let html, json;
    const temp_attribute_name = innerFunction ? `data-temp-id` : `data-temp-id2`;
    if (!tokenizedSplit || tokenizedSplit.length === 0) {
        console.log("Empty tokenizedSplit");
        return { child: input };
    }
    // console.log(JSON.stringify(input))
    html = (0, _1_InsertSplit_1.default)(input, tokenizedSplit);
    json = (0, _2_SplitAndWrap_1.default)(html, tokenizedSplit, elementName, innerFunction, temp_attribute_name);
    // console.log(json2html(json))
    /* TODO: Þetta virkar ekki rétt, sjá "krók og kima" á http://localhost:3000/bl%C3%A6r/silfursvanurinn/3 */
    json = (0, _3_Invert_1.default)(json);
    json = (0, _4_Merge_1.default)(json, temp_attribute_name);
    return json;
};
/*
  Removes the inline data printed in [[Template:Start]]
*/
const RemoveData = (input) => {
    if (!input)
        return input;
    if (Array.isArray(input)) {
        return input.map(RemoveData);
    }
    const { node, attr, child } = input;
    if (node === "element" || node === "root") {
        if (attr && (attr["data-document-start"] || attr["data-document-end"])) {
            return { node: "text", text: "" }; // Hlýtur að vera betri leið til að henda út greinum...
        }
        if (child) {
            return Object.assign(Object.assign({}, input), { child: child.map((e, i) => RemoveData(e, i)) });
        }
        return input;
    }
    return input;
};
