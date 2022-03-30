"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.automaticThu = exports.getHashesFromCommaSeperated = exports.getHash = exports.GetLowercaseStringForAudioKey = exports.getDeckName = void 0;
const hash_1 = __importDefault(require("app/app/functions/hash"));
const isBrowser_1 = require("app/app/functions/isBrowser");
const actions_1 = require("app/user/actions");
const format_1 = require("maker/vocabulary_maker/compile/format");
/* Only used for testing */
const getDeckName = () => {
    var _a, _b, _c;
    if (process.env.NODE_ENV === "development") {
        if (((_a = (0, actions_1.getUserFromCookie)()) === null || _a === void 0 ? void 0 : _a.username) === "danska") {
            return "_da";
        }
        if (((_b = (0, actions_1.getUserFromCookie)()) === null || _b === void 0 ? void 0 : _b.username) === "spænska") {
            return "_es";
        }
        if (((_c = (0, actions_1.getUserFromCookie)()) === null || _c === void 0 ? void 0 : _c.username) === "norska") {
            return "_no";
        }
    }
    return "";
};
exports.getDeckName = getDeckName;
const GetLowercaseStringForAudioKey = (i) => {
    return (0, format_1.getPlaintextFromVocabularyEntry)(i).replace(/[.]+$/, "").toLowerCase();
};
exports.GetLowercaseStringForAudioKey = GetLowercaseStringForAudioKey;
const getHash = (input, options) => {
    if (!input)
        return null;
    if (Array.isArray(input)) {
        return (0, exports.getHash)(input.map(format_1.getPlaintextFromVocabularyEntry).join(";"));
    }
    const string = (0, format_1.getPlaintextFromVocabularyEntry)(input)
        .replace(/[.?!]+$/, "")
        .toLowerCase();
    if (!string)
        return null;
    // return string;
    if ((options === null || options === void 0 ? void 0 : options.skip_hash) ||
        (isBrowser_1.isBrowser &&
            ("skip_hash" in window || window.location.pathname === "/maker"))) {
        return string;
    }
    return (0, hash_1.default)(string);
};
exports.getHash = getHash;
const getHashesFromCommaSeperated = (i) => {
    if (!i)
        return [];
    if (Array.isArray(i)) {
        return i.map(exports.getHash);
    }
    return i.split(",").map(exports.getHash).filter(Boolean);
};
exports.getHashesFromCommaSeperated = getHashesFromCommaSeperated;
const automaticThu = (input) => {
    return input
        .replace(/\b(ert)u\b/gi, "$1{{u}}")
        .replace(/\b(ætlar)ðu\b/gi, "$1{{ðu}}");
};
exports.automaticThu = automaticThu;
