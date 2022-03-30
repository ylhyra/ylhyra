"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sentence_tokenizer_1 = __importDefault(require("documents/parse/Tokenize/Tokenizer/sentence-tokenizer"));
const word_tokenizer_1 = __importDefault(require("documents/parse/Tokenize/Tokenizer/word-tokenizer"));
const Tokenize = ({ paragraphs }) => {
    return paragraphs.map(({ hash, text }) => {
        return {
            hash,
            sentences: (0, sentence_tokenizer_1.default)(text).map((sentence) => {
                return (0, word_tokenizer_1.default)(sentence);
            }),
        };
    });
};
exports.default = Tokenize;
