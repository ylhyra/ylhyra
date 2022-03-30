"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNulls = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Sentence_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Sentence"));
const Word_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Word"));
const Traverse = ({ json, data, index, }) => {
    if (!json)
        return null;
    const { node, tag, attr, child, text } = json;
    if (node === "element" || node === "root") {
        let Tag = tag;
        if (node === "root") {
            return child.map((e, i) => Traverse({ json: e, index: i, data }));
        }
        let extraAttributes = {};
        if (tag === "word") {
            Tag = Word_1.default;
            extraAttributes = { editor: data };
        }
        else if (tag === "sentence") {
            Tag = Sentence_1.default;
        }
        if (Tag) {
            return ((0, jsx_runtime_1.jsx)(Tag, Object.assign({}, extraAttributes, attr, { children: child === null || child === void 0 ? void 0 : child.map((e, i) => Traverse({ json: e, index: i, data })) }), (attr === null || attr === void 0 ? void 0 : attr.id) || index));
        }
    }
    else if (node === "text") {
        return text;
    }
};
const removeNulls = (i) => {
    return i !== null && typeof i !== "undefined";
};
exports.removeNulls = removeNulls;
exports.default = Traverse;
