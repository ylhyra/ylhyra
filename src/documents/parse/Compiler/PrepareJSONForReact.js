"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts certain HTML attributes to React attributes
 */
const inline_style_2_json_1 = __importDefault(require("app/app/functions/inline-style-2-json"));
const Traverse_1 = require("documents/parse/Compiler/2_CompileToHTML/Traverse");
const is_boolean_attribute_1 = __importDefault(require("is-boolean-attribute"));
const react_attr_converter_1 = __importDefault(require("react-attr-converter"));
const Traverse = (json) => {
    if (!json)
        return null;
    let { node, tag, attr, child, text } = json;
    if ((attr === null || attr === void 0 ? void 0 : attr.id) === null) {
        delete attr.id;
    }
    if (node === "element" || node === "root") {
        /*
          Attribute values can be arrays (from html2json).
          Here we merge them together with spaces
        */
        let attr_converted = {};
        for (const property of Object.keys(attr || {})) {
            // Converts HTML attribute into React attribute
            if (property in attr && !property.startsWith("data-temp")) {
                const value = attr[property];
                if (property === "style") {
                    attr_converted[(0, react_attr_converter_1.default)(property)] = (0, inline_style_2_json_1.default)(value);
                }
                else {
                    attr_converted[(0, react_attr_converter_1.default)(property)] = value;
                    if (value === "true" || value === "false") {
                        attr_converted[(0, react_attr_converter_1.default)(property)] = value === "true" ? true : false;
                    }
                    if (value === "" &&
                        ((0, is_boolean_attribute_1.default)(property) ||
                            ["autoplay", "loop"].includes(property))) {
                        attr_converted[(0, react_attr_converter_1.default)(property)] = true;
                    }
                }
            }
        }
        /*
          Always open links in a new window
        */
        if (tag === "a" &&
            attr_converted.href &&
            attr_converted.href.startsWith("http")) {
            // attr_converted.target = "_blank"
            attr_converted.rel = "noopener";
        }
        let out = json;
        if (child) {
            out.child = child.map((e) => Traverse(e)).filter(Traverse_1.removeNulls);
        }
        if (Object.keys(attr_converted).length > 0) {
            out.attr = attr_converted;
        }
        out.tag = (tag === null || tag === void 0 ? void 0 : tag.toLowerCase()) || tag; //GetTemplate(tag) || tag;
        return out;
    }
    else if (node === "text") {
        return json;
    }
};
exports.default = Traverse;
