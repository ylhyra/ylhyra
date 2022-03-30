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
const paths_1 = require("app/app/paths");
const functions_1 = require("documents/compile/functions/functions");
const markdown_to_html_1 = __importDefault(require("documents/compile/markdown_to_html"));
const breadcrumbs_1 = require("documents/compile/templates/breadcrumbs");
const getOrderOfChapters_1 = require("documents/compile/templates/getOrderOfChapters");
const vocabulary_1 = require("documents/compile/vocabulary");
exports.default = (input, header) => __awaiter(void 0, void 0, void 0, function* () {
    let h = "";
    let f = "";
    // console.log(header.vocabulary);
    const vocabulary_data = (0, vocabulary_1.parseVocabularyList)(header.vocabulary);
    const VocabularyHeader = vocabulary_data
        ? `<vocabularyheader data="${(0, functions_1.EncodeDataInHTML)(vocabulary_data)}"/>`
        : "";
    const _breadcrumbs = yield (0, breadcrumbs_1.breadcrumbs)(header);
    const shouldShowVocabularyHeaderAbove = 
    // true ||
    !header.title.startsWith("Course/") &&
        (header.has_data || input.length > 4000);
    if (true || vocabulary_data || header.level || header.has_data) {
        h = (0, no_undefined_in_template_literal_1.default) `
      <section class="tiny wide">
        ${header.level &&
            `<div class="float-right"><level level="${header.level}"/></div>`}
        ${_breadcrumbs}
        <Spacer space="10"/>
        <div class="center">
          <div>
            ${shouldShowVocabularyHeaderAbove && VocabularyHeader}
            ${header.has_data &&
            `<div class="gray small" style="margin:6px 0 10px 0;">Click on words to see their translations.</div>`}
          </div>
        </div>
      </section>`;
    }
    let FooterInfoFromPage;
    input = input.replace(/<Footer>([\s\S]+)<\/Footer>/i, (x, data) => {
        FooterInfoFromPage = data;
        return "";
    });
    if (input.trim()) {
        input = (0, no_undefined_in_template_literal_1.default) `<main class="${/Image position="right/.test(input) && "has-image"}">${input}</main>`;
    }
    // input += '<div class="spacer-below-content"></div>';
    if (VocabularyHeader) {
        input += `<section class="vocabulary-footer"><div class="center">${VocabularyHeader}</div></section>`;
    }
    /* Automatic prev and next for course articles */
    const url = (0, paths_1.URL_title)(header.title);
    if (header.title !== "Course") {
        const order = yield (0, getOrderOfChapters_1.getOrder)();
        if (order.includes(url)) {
            const i = order.indexOf(url);
            const prev = i >= 0 && order[i - 1];
            const next = order[i + 1];
            let y = "";
            if (prev) {
                y += `<a href="${prev}" class="button gray small">Previous article</a>`;
            }
            if (next) {
                y += `<a href="${next}" class="button right gray small">Next article</a><div class="clear"></div>`;
            }
            input += `<section>${y}</section>`;
        }
    }
    if (header.license ||
        header.published ||
        header.reflist ||
        FooterInfoFromPage) {
        f = (0, no_undefined_in_template_literal_1.default) `
      <section class="content-footer">
        ${FooterInfoFromPage}
        ${header.reflist && (0, markdown_to_html_1.default)(header.reflist)}

        ${header.license === "CC0" &&
            (0, no_undefined_in_template_literal_1.default) `<div class="license">You are free to republish this article <span class="license-link">(${input.includes("<Inflection") && "Text: "}<a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener" target="_blank">CC0 / public domain</a>${input.includes("<Inflection") &&
                '; <a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">BÍN</a> tables: <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a>'})</span></div>`}
        ${header.published &&
            `<small class="gray">Published ${header.published}</small>`}
        
        ${header["typos fixed"] &&
            `
            <div class="gray low-lineheight extra-small">
              The version of this article published on Ylhýra includes 
              minor standardizations of orthography or grammar.
            </div>
        `}

      </section>`;
    }
    return h + input + f;
});
