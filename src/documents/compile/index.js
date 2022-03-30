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
const images_1 = __importDefault(require("documents/compile/images"));
const markdown_to_html_1 = __importDefault(require("documents/compile/markdown_to_html"));
const HeaderAndFooter_1 = __importDefault(require("documents/compile/templates/HeaderAndFooter"));
const inflection_1 = __importDefault(require("documents/compile/templates/inflection"));
const Ref_1 = require("documents/compile/templates/Ref");
const Sections_1 = __importDefault(require("documents/compile/templates/Sections"));
const Table_1 = __importDefault(require("documents/compile/templates/Table"));
const transclude_1 = __importDefault(require("documents/compile/transclude"));
exports.default = (title) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { output, header } = yield (0, transclude_1.default)(title);
    if (!output) {
        console.log(`\n"${title}" has no body`);
        return {};
    }
    output = (0, Table_1.default)(output, header);
    output = (0, Sections_1.default)(output, header);
    const t = (0, Ref_1.Ref)(output, header);
    output = t.output;
    header = t.header;
    output = yield (0, images_1.default)(output);
    output = (0, markdown_to_html_1.default)(output);
    output = yield (0, HeaderAndFooter_1.default)(output, header);
    output = yield (0, inflection_1.default)(output);
    output = `<div class="content-wrapper ${((_a = header.classes) === null || _a === void 0 ? void 0 : _a.join(" ")) || ""}">${output}</div>`;
    if (output.includes("SUBSTITUTION")) {
        console.error(`"${title}" included SUBSTITUTION`);
        if (process.env.NODE_ENV === "production") {
            throw new Error("");
        }
    }
    // console.log(output)
    return { content: output, header };
});
