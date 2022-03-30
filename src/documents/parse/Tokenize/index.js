"use strict";
/*
  _____     _              _
 |_   _|__ | | _____ _ __ (_)_______
   | |/ _ \| |/ / _ \ '_ \| |_  / _ \
   | | (_) |   <  __/ | | | |/ /  __/
   |_|\___/|_|\_\___|_| |_|_/___\___|

  1. Extracts raw text from input
  2. Sends text to server for tokenization
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("app/app/functions/hash"));
const CreateIDs_1 = __importDefault(require("documents/parse/Tokenize/IDs/CreateIDs"));
const PreserveIDs_1 = __importDefault(require("documents/parse/Tokenize/IDs/PreserveIDs"));
const Tokenizer_1 = __importDefault(require("documents/parse/Tokenize/Tokenizer"));
const underscore_1 = __importDefault(require("underscore"));
function default_1(documents, data) {
    let tokenized = {};
    for (const documentTitle of Object.keys(documents)) {
        tokenized[documentTitle] = tokenize({
            documentTitle,
            paragraphs: documents[documentTitle],
            previousData: data[documentTitle] || {},
        });
    }
    return tokenized;
}
exports.default = default_1;
const tokenize = ({ documentTitle, paragraphs, previousData }) => {
    var _a;
    const oldHashes = ((_a = previousData.tokenized) === null || _a === void 0 ? void 0 : _a.map((p) => p.hash)) || [];
    /*
      We do not want to unnecessarily recalculate tokenization.
    */
    const paragraphsMissingTokenization = underscore_1.default.uniq(paragraphs.filter((p) => !oldHashes.includes(p.hash)));
    let tokenized = (0, Tokenizer_1.default)({
        paragraphs: paragraphsMissingTokenization,
    });
    /*
      Since we only calculated tokenization for things that have changed,
      here we merge the output with previously calculated tokenizations.
    */
    const arrayOfNewAndOldTokenizations = [
        ...(previousData.tokenized || []),
        ...tokenized, // New tokenization
    ];
    tokenized = paragraphs.map((p) => {
        return Object.assign(Object.assign({}, arrayOfNewAndOldTokenizations.find((i) => i.hash === p.hash)), { index: p.index });
    });
    // console.log(tokenized)
    tokenized = (0, CreateIDs_1.default)(documentTitle, tokenized);
    if (previousData.tokenized) {
        tokenized = (0, PreserveIDs_1.default)(previousData.tokenized, tokenized);
    }
    /*
      "Paragraph" currently only contains a hash of the text.
      Here we add a hash of the IDs
    */
    tokenized = tokenized.map((paragraph) => (Object.assign(Object.assign({}, paragraph), { hashOfIds: hashOfIds(paragraph) })));
    return tokenized;
};
const hashOfIds = (paragraph) => {
    let ids = [];
    paragraph.sentences.forEach((sentence) => {
        ids.push(sentence.id);
        sentence.words.forEach((word) => {
            ids.push(word.id);
        });
    });
    return (0, hash_1.default)(ids);
};
