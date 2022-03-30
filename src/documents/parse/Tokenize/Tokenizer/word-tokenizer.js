"use strict";
/**

  Attempts to split Latin-script sentences into words.

  It is preferable to do this with natural language processing.

  @returns An array of words

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordRegex = void 0;
const xregexp_1 = __importDefault(require("xregexp"));
const startOfWord = "[A-zÀ-ÿ·-]";
const middleOfWord = "[A-zÀ-ÿ·\\-'’.,:0-9]";
const endOfWord = "[A-zÀ-ÿ·\\-']";
exports.wordRegex = (0, xregexp_1.default)(`((?:${startOfWord}(?:(?:${middleOfWord}+)?${endOfWord})?)|[0-9]+)`, "g");
exports.default = (input) => {
    return input.split(exports.wordRegex).filter(Boolean);
};
