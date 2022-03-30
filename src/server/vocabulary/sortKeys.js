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
const compile_1 = __importDefault(require("documents/compile"));
const functions_1 = require("documents/compile/functions/functions");
exports.default = (getRawSentences) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.DECK)
        return {};
    /****************
     * Read the page "Course" and find the order of its vocabulary list
     ***************/
    const { content } = yield (0, compile_1.default)("course");
    let i = 1;
    let sortKeys = {}; /* Term to sortKey */
    let sentences = {};
    content.replace(/data="([^"]+?)"/g, (x, data) => {
        const v = (0, functions_1.DecodeDataInHTML)(data);
        if (!v)
            return;
        v.terms.forEach((term_id) => {
            if (!(term_id in sortKeys)) {
                sortKeys[term_id] = i;
                // if (getRawSentences) {
                //   sentences[GetLowercaseStringForAudioKey(value)] = i;
                // }
                i++;
            }
        });
        // values.forEach((value) => {
        //   value = value.split(" = ")[0];
        //   const hash = getHash(value);
        //   if (!(hash in sortKeys)) {
        //     sortKeys[hash] = i;
        //     if (getRawSentences) {
        //       sentences[GetLowercaseStringForAudioKey(value)] = i;
        //     }
        //     i++;
        //   }
        // });
    });
    console.log(`${i} terms in course`);
    if (getRawSentences)
        return sentences;
    return sortKeys;
});
