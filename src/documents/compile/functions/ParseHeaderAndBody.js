"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseHeaderAndBody = void 0;
const functions_1 = require("documents/compile/functions/functions");
const format_1 = require("maker/vocabulary_maker/compile/format");
const yaml = require("js-yaml");
const ParseHeaderAndBody = (data, file) => {
    data = (0, functions_1.removeComments)(data);
    const match = data.trim().match(/^---\n([\s\S]+?)\n---([\s\S]+)?/);
    if (!match) {
        console.warn("Failed to parse\n\n" + data);
        return {};
    }
    let [, header, body] = match;
    // header = header.replace(/: (.+):/g, ': $1\\:')
    header = yaml.load(header);
    body = (body || "").trim();
    if (!header.title && header.title !== "") {
        throw new Error("Missing title\n\n" + data);
    }
    if (!header.level && /\/[abc][123]\//i.test(file)) {
        header.level = file.match(/\/([abc][123])\//i)[1].toUpperCase();
    }
    if (!("license" in header) && header.title.startsWith("Course/")) {
        header.license = "CC0";
    }
    body = body.replace(/<vocabulary>([\s\S]+?)<\/vocabulary>/g, (x, voc) => {
        if (voc.trim().length > 0) {
            header.vocabulary = voc
                .split(/\n/g)
                .filter(Boolean)
                .map(format_1.getPlaintextFromVocabularyEntry);
        }
        return "";
    });
    return { header, body };
};
exports.ParseHeaderAndBody = ParseHeaderAndBody;
