"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeDataInHTML = exports.EncodeDataInHTML = exports.removeComments = void 0;
const atob_1 = __importDefault(require("atob"));
const btoa_1 = __importDefault(require("btoa"));
const removeComments = (i) => i.replace(/<!--([\s\S]+?)-->/g, "").replace(/\n<!--([\s\S]+?)-->\n/g, "\n");
exports.removeComments = removeComments;
/**
 * Returns Base64-encoded
 */
const EncodeDataInHTML = (input, alreadyStringified) => {
    if (!input)
        return;
    return (0, btoa_1.default)(encodeURIComponent(alreadyStringified ? input : JSON.stringify(input)));
};
exports.EncodeDataInHTML = EncodeDataInHTML;
const DecodeDataInHTML = (input, isString) => {
    if (!input)
        return;
    const v = decodeURIComponent((0, atob_1.default)(input));
    return isString ? v : JSON.parse(v);
};
exports.DecodeDataInHTML = DecodeDataInHTML;
