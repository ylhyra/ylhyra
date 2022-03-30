"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchWordsAndLettersOrSpaces = exports.matchWordsAndLetters = exports.matchWords = void 0;
exports.matchWords = /(\p{Script=Latin}+)/giu;
exports.matchWordsAndLetters = /([\p{Script=Latin}0-9]+)/giu;
exports.matchWordsAndLettersOrSpaces = /([\p{Script=Latin}0-9]+| +)/giu;
// [a-záéíóúýðþæö]
