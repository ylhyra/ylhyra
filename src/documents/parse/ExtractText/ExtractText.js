"use strict";
/*
   ____                    _            _
  |  _ \ __ ___      __   | |_ _____  _| |_
  | |_) / _` \ \ /\ / /   | __/ _ \ \/ / __|
  |  _ < (_| |\ V  V /    | ||  __/>  <| |_
  |_| \_\__,_| \_/\_/      \__\___/_/\_\\__|

  1. Parses input
  2. Splits into paragraphs
  3. Gets raw text
  4. Returns a list of paragraphs (text & hash)

*/
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getText = void 0;
const hash_1 = __importDefault(require("app/app/functions/hash"));
const parse_1 = require("documents/parse");
const Paragraphs_1 = __importDefault(require("documents/parse/ExtractText/Paragraphs"));
const emoji_strip_1 = __importDefault(require("emoji-strip"));
/*
  Convert document into raw text
*/
function default_1(json /*onlyRetrieveEntireDocuments*/) {
    let paragraphs = [];
    let index = 0;
    (0, Paragraphs_1.default)({
        input: json,
        getNewTitle: new parse_1.newTitle(),
        paragraphFunction: (paragraph, documentTitle) => {
            const text = (0, exports.getText)(paragraph, true, true);
            // console.log(text)
            // console.log(documentTitle)
            if (documentTitle === undefined) {
                // console.log(
                //   `Missing {{start}} for document which includes the text ${text}`
                // );
                return;
            }
            if (text) {
                paragraphs.push({
                    index: index++,
                    documentTitle: documentTitle || "untitled",
                    hash: (0, hash_1.default)(text),
                    text: text,
                });
                // console.log(index)
            }
        },
        // onlyRetrieveEntireDocuments
    });
    let documents = {};
    paragraphs.forEach((_a) => {
        var { documentTitle } = _a, paragraph = __rest(_a, ["documentTitle"]);
        if (!documents[documentTitle]) {
            documents[documentTitle] = [];
        }
        documents[documentTitle].push(paragraph);
    });
    return documents;
}
exports.default = default_1;
/*
  Turns a JSON representation of HTML into raw text
*/
const getText = (data, clean = false, trim = false) => {
    // console.log(data)
    const getTextFromJson = (input) => {
        if (typeof input === "string") {
            return input;
        }
        if (input.node === "text") {
            return input.text;
        }
        if (input.child) {
            return input.child
                .map((i) => {
                if (shouldIgnore(i))
                    return " ";
                return getTextFromJson(i);
            })
                .join("");
        }
        if (Array.isArray(input)) {
            return input
                .map((i) => {
                if (shouldIgnore(i))
                    return " ";
                return getTextFromJson(i);
            })
                .join("");
        }
        return "";
    };
    const cleanText = (input) => {
        return input.replace(IgnoredCharacters, "").replace(/[\s]+/gm, " ");
    };
    let returns = getTextFromJson(data);
    if (clean) {
        returns = (0, emoji_strip_1.default)(cleanText(returns));
    }
    if (trim) {
        returns = returns
            .replace(/{+.+?}+/g, "") // Removes text in brackets, like "{kvk}"
            .replace(/[\s]+/gm, " ")
            .trim();
    }
    return returns;
};
exports.getText = getText;
/*
  1. soft hyphen
*/
const IgnoredCharacters = /\u00AD/g;
const shouldIgnore = (i) => {
    if (i.tag === "sup")
        return true;
    return i.attr && (i.attr["data-not-text"] || i.attr["data-children"]);
};
