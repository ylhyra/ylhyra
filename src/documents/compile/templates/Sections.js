"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
exports.default = (input, header) => {
    var _a;
    const is_course = /Course\//.test(header.title);
    if (true || is_course) {
        input =
            "SECTION_START" +
                input
                    .replace(/^(==[^=](?:.+)?==)$/gm, "SECTION_ENDSECTION_START$1")
                    .replace(/(<section)/g, "SECTION_END$1")
                    .replace(/(<\/section>)/g, "$1SECTION_START") +
                "SECTION_END";
        input = input.replace(/SECTION_START([\s]+|<span.+?\/span>\n)?SECTION_END/g, "");
        let i = 0;
        const isContent = !((_a = header.classes) === null || _a === void 0 ? void 0 : _a.includes("not-content")) && (true || is_course);
        input = input.replace(/(SECTION_START([\s\S]+?)SECTION_END)/g, (j, k, content) => {
            return (0, no_undefined_in_template_literal_1.default) `<section class="
          ${isContent && "content"}
          ${i === 0 && "first"}
          ${i++ % 2 !== 0 && "odd"}
          ${/Image.+position="right/.test(content) && "has-image"}
        ">${content}</section>`;
        });
        // input = input
        //   .split(/==([^=]+)==\n/g)
        //   .map((j, index) => {
        //     return `<div class="section">${j}</div>`;
        //   })
        //   .join("");
    }
    return input;
};
