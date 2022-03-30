"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Link_1 = __importDefault(require("app/router/Link"));
const _list_1 = __importDefault(require("documents/templates/_list"));
const Traverse = ({ json, data, index }) => {
    if (!json)
        return null;
    let { node, tag, attr, child, text } = json;
    if (node === "element" || node === "root") {
        let Tag = tag || "span";
        attr = attr || {};
        if (node === "root") {
            return child.map((e, i) => Traverse({ json: e, index: i, data }));
        }
        if (tag === "a") {
            Tag = Link_1.default;
        }
        else {
            Tag = (0, _list_1.default)(tag) || Tag;
        }
        /* IMG and HR tags are void tags */
        if (voidElementTags.includes(Tag)) {
            return (0, react_1.createElement)(Tag, Object.assign({}, attr, { key: (attr === null || attr === void 0 ? void 0 : attr.id) || index }));
        }
        /*
          Convert custom elements to 'span' or 'div'
          and add their name as a className
        */
        if (typeof Tag === "string") {
            getCustomTag(Tag, attr === null || attr === void 0 ? void 0 : attr.className, (output) => {
                Tag = output.tag;
                attr.className = output.className;
            });
        }
        return ((0, react_1.createElement)(Tag, Object.assign({}, attr, { key: (attr === null || attr === void 0 ? void 0 : attr.id) || index }), child === null || child === void 0 ? void 0 : child.map((e, i) => Traverse({ json: e, data, index: i }))));
    }
    else if (node === "text") {
        return text;
    }
};
exports.default = Traverse;
/*
  Allow for specific custom elements.
*/
const customTags = {
    "p": "div",
    "center": "div",
    "translate": "span",
    "isl": "span",
    "small-box": "span",
};
const getCustomTag = (tag, className, callback) => {
    if (tag in customTags) {
        className = ((className || "") + " " + tag).trim();
        tag = customTags[tag];
    }
    callback({ tag, className });
};
const voidElementTags = [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];
