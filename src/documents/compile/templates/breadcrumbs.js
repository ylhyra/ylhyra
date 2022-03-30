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
exports.breadcrumbs = void 0;
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const paths_1 = require("app/app/paths");
const getOrderOfChapters_1 = require("documents/compile/templates/getOrderOfChapters");
const links_1 = require("server/content/links");
const breadcrumbs = (header) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    if (!header.title)
        return;
    const parts = header.title.split(/\//g);
    let namespaces = [];
    const v = (0, links_1.getValuesForURL)(header.title);
    if ((_a = v.filepath) === null || _a === void 0 ? void 0 : _a.includes("/poems/")) {
        namespaces.push("Poems");
    }
    else if ((_b = v.filepath) === null || _b === void 0 ? void 0 : _b.includes("/video/")) {
        namespaces.push("Video");
    }
    else if (((_c = v.filepath) === null || _c === void 0 ? void 0 : _c.includes("/reading/")) &&
        !((_d = v.filepath) === null || _d === void 0 ? void 0 : _d.includes("/tweets/")) &&
        header.title !== "Texts") {
        namespaces.push('<a href="/texts">Texts</a>');
    }
    else if (((_e = v.filepath) === null || _e === void 0 ? void 0 : _e.includes("/explanations/")) &&
        header.title !== "Explanations") {
        namespaces.push('<a href="/explanations">Explanations</a>');
    }
    if (header.title.startsWith("Course/")) {
        const url_to_unit = yield (0, getOrderOfChapters_1.getOrder)(false, true);
        if (v.url in url_to_unit) {
            const n = `Unit ${url_to_unit[v.url]}`;
            parts.splice(1, 0, `<a href="/course#${(0, paths_1.section_id)(n)}">${n}</a>`);
        }
    }
    else if (namespaces.length === 0) {
        return null;
    }
    return (0, no_undefined_in_template_literal_1.default) `<div id="breadcrumbs-title">
    <div>
      ${namespaces.map((namespace, index) => {
        return (0, no_undefined_in_template_literal_1.default) `
          <div class="title-part namespace">${namespace}</div>
          <div class="title-separator"></div>
        `;
    })}
      ${parts.map((part, index) => {
        if (!part)
            return;
        const last = index === parts.length - 1;
        let name = part;
        /**
         * Used for "Part 1", "Part 2"
         * @type {boolean}
         */
        let isAPartIndicator = false;
        if (/^\d+$/.test(name)) {
            name = `Part ${name}`;
            isAPartIndicator = true;
        }
        /* Adds italics to parentheses */
        name = name.replace(/(\(.+?\))/g, (parenthetical) => {
            return `<i>${parenthetical}</i>`;
        });
        /* Bold the name of the story if it is next to the "Part 1" thing */
        const secondLastToParts = index === parts.length - 2 && /^\d+$/.test(parts[index + 1]);
        if (!last) {
            const urlForThisPart = (0, links_1.getValuesForURL)(parts.slice(0, index + 1).join("/")).url;
            // console.log(urlForThisPart);
            if (urlForThisPart && urlForThisPart !== (0, paths_1.URL_title)(header.title)) {
                name = `<a href="${urlForThisPart}">${name}</a>`;
            }
        }
        return (0, no_undefined_in_template_literal_1.default) `
          <div class="title-part ${(last || secondLastToParts) && !isAPartIndicator && "bold"} ${((["Course"].includes(part) && !last) || isAPartIndicator) &&
            "namespace"}">${name.startsWith("<a") ? name : `<span>${name}</span>`}</div>
          ${!last && `<div class="title-separator"></div>`}
        `;
    })}
    </div>
  </div>`;
});
exports.breadcrumbs = breadcrumbs;
