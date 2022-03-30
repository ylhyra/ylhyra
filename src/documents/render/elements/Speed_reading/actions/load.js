"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const store_1 = __importDefault(require("app/app/store"));
const load = () => {
    let words = [];
    let book = $(".book").clone();
    book.find(".box, .word-box, .tooltip,.inline_translation").remove();
    book.find("p").each((pi, paragraphEl) => {
        words.last &&
            words.push({
                length: 2,
                type: "pause",
            });
        $(paragraphEl)
            .find(".sentence")
            .each((si, sentenceEl) => {
            words.last &&
                words.last.type !== "pause" &&
                words.push({
                    length: 1,
                    type: "pause",
                });
            const sentenceId = $(sentenceEl).attr("id");
            const sentenceTranslation = $(".book")
                .find(`#${sentenceId}-box .meaning`)
                .text();
            $(sentenceEl)
                .contents()
                .each((ii, item) => {
                if (item.nodeType === Node.TEXT_NODE) {
                    if ($(item).text().trim() === "")
                        return;
                    words.push({
                        text: $(item).text(),
                        type: "punctuation",
                    });
                }
                else {
                    const text = $(item).text();
                    const itemId = $(item)
                        .find(".word[data-word-has-definition]")
                        .attr("id");
                    const difficult = $(".book")
                        .find(`#${itemId}`)
                        .closest(".word-container")
                        .is(".has-inline-translation");
                    const translation = $(".book")
                        .find(`#${itemId}-tooltip .meaning`)
                        .text();
                    words.push({
                        text,
                        translation,
                        sentenceTranslation,
                        difficult,
                    });
                }
            });
        });
    });
    words = words
        .map((item, index) => {
        var _a, _b, _c;
        if (item.type === "punctuation") {
            const split = item.text.split(/^([^ ]+)?(.+?)?([^ ]+)?$/);
            let first = split[1];
            let middle = split[2];
            let end = split[3];
            if (first && ((_a = words[index - 1]) === null || _a === void 0 ? void 0 : _a.text)) {
                words[index - 1].text += first;
                first = null;
            }
            if (first && !middle && !end) {
                end = first;
                first = null;
            }
            if (end && ((_b = words[index + 1]) === null || _b === void 0 ? void 0 : _b.text)) {
                words[index + 1].text = end + words[index + 1].text;
                end = null;
            }
            const remaining = (first || "") + (middle || "") + (end || "");
            if (remaining.trim()) {
                return {
                    text: remaining.trim(),
                    type: "punctuation",
                };
            }
            return null;
        }
        if (item.type === "pause" && item.length === 1) {
            if ((_c = words[index - 1]) === null || _c === void 0 ? void 0 : _c.text) {
                if (/[,;]$/.test(words[index - 1].text)) {
                    return null;
                }
            }
        }
        return item;
    })
        .filter(Boolean);
    // console.log(words)
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        words,
    });
};
exports.load = load;
