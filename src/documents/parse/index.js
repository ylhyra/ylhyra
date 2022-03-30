"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTitle = void 0;
const error_1 = require("app/app/error");
const html2json_1 = require("app/app/functions/html2json");
const isBrowser_1 = require("app/app/functions/isBrowser");
const Compiler_1 = __importDefault(require("documents/parse/Compiler"));
const ExtractData_1 = __importDefault(require("documents/parse/ExtractData"));
const ExtractText_1 = __importDefault(require("documents/parse/ExtractText/ExtractText"));
const Tokenize_1 = __importDefault(require("documents/parse/Tokenize"));
const WrapInTags_1 = __importDefault(require("documents/parse/WrapInTags"));
const html_entities_1 = require("html-entities");
const is_empty_object_1 = __importDefault(require("is-empty-object"));
const entities = new html_entities_1.AllHtmlEntities();
/*
  Parser
*/
exports.default = ({ html }) => {
    if (!html)
        return null;
    try {
        html = entities.decode(html);
        html = html
            .replace(/[\s\n\r]+/g, " ") // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
            .replace(/\u00AD/g, " ") // Soft-hyphens
            .replace(/\u00A0/g, " "); // Non-breaking spaces
        let json = (0, html2json_1.html2json)(html);
        /*
          Is data already saved?
        */
        let data = (0, ExtractData_1.default)(json);
        /*
          Extract text, group by documents
        */
        const text = (0, ExtractText_1.default)(json);
        if ((0, is_empty_object_1.default)(text)) {
            return { parsed: (0, Compiler_1.default)({ json }) };
        }
        const tokenized = (0, Tokenize_1.default)(text, data);
        const flattenedData = flattenData(data);
        /*
          Merge tokenization and HTML (does not include data).
          Returns wrapped HTML without data
        */
        const wrapped = (0, WrapInTags_1.default)({ json, tokenized });
        let compiled = (0, Compiler_1.default)({ json: wrapped, data: flattenedData });
        return {
            parsed: compiled,
            tokenized,
            data,
            flattenedData,
        };
    }
    catch (e) {
        console.error(e);
        if (isBrowser_1.isBrowser) {
            (0, error_1.notify)("Error in parse step");
        }
    }
};
const flattenData = (input) => {
    let output = {
        translation: {
            definitions: {},
            sentences: {},
            words: {},
        },
        list: {
            arrayOfAllItemIDs: [],
            arrayOfAllWordIDs: [],
            items: {},
            sentences: {},
            words: {},
        },
        short_audio: {
            soundList: [],
            sounds: {},
            wordID_to_text: {},
        },
        long_audio: {},
    };
    for (const documentTitle of Object.keys(input)) {
        output = merge(output, input[documentTitle]);
    }
    return output;
};
const merge = (first, second) => {
    if (Array.isArray(first)) {
        return [...first, ...second];
    }
    else if (typeof first === "object") {
        let output = first;
        if (second && typeof second === "object") {
            for (const key of Object.keys(second)) {
                if (output[key]) {
                    output[key] = merge(output[key], second[key]);
                }
                else {
                    output[key] = second[key];
                }
            }
        }
        return output;
    }
};
/*
  Prevent clashes if the same document is transcluded twice
*/
class newTitle {
    constructor() {
        this.index = 0;
        this.array = [];
    }
    get(title) {
        if (this.array.includes(title)) {
            title = this.get(title + "1");
        }
        this.array.push(title);
        return title;
    }
}
exports.newTitle = newTitle;
