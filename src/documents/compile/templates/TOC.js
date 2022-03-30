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
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const replaceAsync_1 = require("app/app/functions/replaceAsync");
const paths_1 = require("app/app/paths");
const functions_1 = require("documents/compile/functions/functions");
const transclude_1 = __importDefault(require("documents/compile/transclude"));
const vocabulary_1 = require("documents/compile/vocabulary");
exports.default = (text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!/<TOC>/.test(text))
        return text;
    text = yield (0, replaceAsync_1.replaceAsync)(text, /<TOC>([\s\S]+)<\/TOC>/g, (x, content) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, replaceAsync_1.replaceAsync)(content, /{{(link with percentage|link with vocabulary list|chapter)\|([^|\n]+?)(?:\|([^|\n]+)?)?(?:\|([^|\n]+)?)?}}/g, (j, template, link, title, small) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            title = title || link.replace("Course/", "");
            const transclusion = yield (0, transclude_1.default)(link);
            // console.log(transclusion);
            const vocabulary = (_a = transclusion.header) === null || _a === void 0 ? void 0 : _a.vocabulary;
            const data = vocabulary
                ? (0, functions_1.EncodeDataInHTML)((0, vocabulary_1.parseVocabularyList)(vocabulary))
                : null;
            return (0, no_undefined_in_template_literal_1.default) `<Chapter data="${data}"
              ${(template === "link with vocabulary list" ||
                template === "chapter") &&
                'show_words="yes"'}
              chapter_url="${(0, paths_1.URL_title)(link)}">${title} ${small && `<small>${small}</small>`}</Chapter>`;
        }));
    }));
    return `<div class="toc">${text}</div>`;
});
