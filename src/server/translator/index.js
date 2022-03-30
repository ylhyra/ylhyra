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
const hash_1 = __importDefault(require("app/app/functions/hash"));
const grammatical_analysis_1 = __importDefault(require("server/grammatical-analysis"));
const GetSuggestions_1 = __importDefault(require("server/translator/GetSuggestions"));
const GoogleTranslate_1 = __importDefault(require("server/translator/GoogleTranslate"));
const VerifyMediawikiSession_1 = __importDefault(require("server/VerifyMediawikiSession"));
const request = ({ list, tokenized, translation, suggestions, session_verification_token }, send) => __awaiter(void 0, void 0, void 0, function* () {
    if (!list /*|| !to || !from*/)
        return;
    if (!list || !list.arrayOfAllWordIDs)
        return;
    let output = {};
    const user = yield (0, VerifyMediawikiSession_1.default)(session_verification_token);
    if (!user) {
        return; //TODO: Error message
    }
    /*
      Grammatical analysis
    */
    const analysis = yield (0, grammatical_analysis_1.default)(tokenized);
    // console.log(JSON.stringify(analysis))
    /*
      Our translations
    */
    let ourSuggestions = yield (0, GetSuggestions_1.default)({
        list,
        tokenized,
        translation,
        suggestions,
    });
    ourSuggestions.forEach((i) => {
        output[i.item_id] = [
            ...(output[i.item_id] || []),
            {
                definition: JSON.parse(i.definition),
            },
        ];
    });
    /*
      Google Translate
    */
    if (user.groups.includes("sysop")) {
        /* Collect words needing translation */
        let translation_hashes = {};
        list.arrayOfAllWordIDs.forEach((id) => {
            if (!translation.words[id] && !output[id]) {
                const hash = (0, hash_1.default)(list.words[id].text);
                const text = list.words[id].text;
                translation_hashes[hash] = {
                    text,
                };
            }
        });
        Object.keys(list.sentences).forEach((id) => {
            if (!translation.sentences[id] && !output[id]) {
                const hash = (0, hash_1.default)(list.sentences[id].text);
                const text = list.sentences[id].text;
                translation_hashes[hash] = {
                    text,
                };
            }
        });
        const g = yield (0, GoogleTranslate_1.default)(translation_hashes);
        list.arrayOfAllWordIDs.forEach((id) => {
            const hash = (0, hash_1.default)(list.words[id].text);
            // const text = list.words[id].text
            if (g[hash]) {
                output[id] = [
                    {
                        definition: {
                            meaning: g[hash],
                        },
                    },
                ];
            }
        });
        Object.keys(list.sentences).forEach((id) => {
            const hash = (0, hash_1.default)(list.sentences[id].text);
            // const text = list.sentences[id].text
            if (g[hash]) {
                output[id] = [
                    {
                        definition: {
                            meaning: g[hash],
                        },
                    },
                ];
            }
        });
    }
    send({
        type: "SUGGEST",
        definitions: output,
        analysis,
    });
});
exports.default = request;
