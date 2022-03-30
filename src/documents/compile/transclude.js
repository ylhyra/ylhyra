"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscludeFromText = void 0;
const array_foreach_async_1 = __importDefault(require("app/app/functions/array-foreach-async"));
const paths_1 = require("app/app/paths");
const functions_1 = require("documents/compile/functions/functions");
const ParseHeaderAndBody_1 = require("documents/compile/functions/ParseHeaderAndBody");
const TOC_1 = __importDefault(require("documents/compile/templates/TOC"));
const links_1 = require("server/content/links");
const loadLinks_1 = require("server/content/loadLinks");
var fs = require("fs");
const Transclude = (title, depth = 0, shouldGetData = true) => {
    return new Promise((resolve) => {
        let values = (0, links_1.getValuesForURL)((depth > 0 && !title.startsWith("Text:") && !title.startsWith(":")
            ? "Template:"
            : "") + title);
        // console.log({ title, depth });
        if (!values.filepath) {
            // values = getValuesForURL(title);
            // if (!values.filepath) {
            console.log(`\nNo template named "${title}"\n`);
            process.exit();
            return resolve();
            // }
        }
        fs.readFile(values.filepath, "utf8", (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return resolve(`\nFailed to read file for ${title}\n`);
            }
            let { header, body } = (0, ParseHeaderAndBody_1.ParseHeaderAndBody)(data, values.filepath);
            let output = body;
            /* Strip comments */
            output = (0, functions_1.removeComments)(output);
            /* Certain templates currently require
             * pre-processing to access header data  */
            /* TODO: Move elsewhere */
            output = yield (0, TOC_1.default)(output);
            let i = 0;
            output = output.replace(/{{incr}}/g, () => {
                return i++ + 1;
            });
            if (depth < 1 && shouldGetData) {
                output = yield (0, exports.TranscludeFromText)(output, depth);
            }
            if (shouldGetData) {
                const data2 = yield getData(header);
                if (data2) {
                    output =
                        `<span data-document-start="${(data2 || header).title}" data-data="${data2 ? (0, functions_1.EncodeDataInHTML)(data2.output, true) : ""}"></span>` +
                            output +
                            `<span data-document-end="${(data2 || header).title}"></span>`;
                    output = output.replace(/(<\/span>)(?:==##)/g, "$1\n$2");
                    header.has_data = true;
                }
            }
            resolve({ output, header });
        }));
    });
};
const TranscludeFromText = (input, depth) => __awaiter(void 0, void 0, void 0, function* () {
    let output = "";
    input = input
        .replace(/{{{+/g, "&lbrace;&lbrace;&lbrace;")
        .replace(/}}}+/g, "&rbrace;&rbrace;&rbrace;");
    yield (0, array_foreach_async_1.default)(input.split(/{{([^{}]+)}}/g), (q, index) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve2) => __awaiter(void 0, void 0, void 0, function* () {
            if (index % 2 === 0) {
                output += q;
                return resolve2();
            }
            /* Get header info */
            /* TODO: Find better syntax to get header info */
            if (/(>>>)/.test(q)) {
                const [title_, param_] = q.split(">>>");
                const transclusion = yield Transclude(title_, depth + 1);
                if (transclusion.header) {
                    output += (0, functions_1.EncodeDataInHTML)(transclusion.header[param_]);
                }
                // .replace(/"/g,'\\"')
            }
            else {
                /* Transclude */
                let [name, ...params] = q.split(/\|/);
                const transclusion = yield Transclude(name, depth + 1);
                let output2 = transclusion === null || transclusion === void 0 ? void 0 : transclusion.output;
                if (output2) {
                    if (params) {
                        output2 = output2.replace(/(\$([0-9]*))/g, (q, w, number) => {
                            return (params[parseInt(number) - 1] || "").trim();
                        });
                    }
                    output += output2;
                }
                else {
                    output += `&lbrace;&lbrace;${name}&rbrace;&rbrace;`;
                    console.log(`Missing template: "${name}"`);
                }
            }
            return resolve2();
        }));
    }));
    // console.log(output);
    /* Recursively transclude deeper */
    if (/{{/.test(output) && output !== input && depth <= 3) {
        if (depth === 3) {
            console.log({ output, input });
        }
        output = yield (0, exports.TranscludeFromText)(output, depth + 1);
    }
    return output;
});
exports.TranscludeFromText = TranscludeFromText;
const getData = (header) => __awaiter(void 0, void 0, void 0, function* () {
    const data_title = [header.title, ...(header.redirects || [])].find((t) => (0, paths_1.URL_title)("Data:" + t) in loadLinks_1.links);
    if (!data_title)
        return;
    const output = (yield Transclude("Data:" + data_title, 0, false)).output;
    // console.log(output.slice(0, 100))
    // return;
    //
    // console.log(output);
    return {
        output: JSON.stringify(JSON.parse(output)),
        title: data_title,
    };
});
exports.default = Transclude;
