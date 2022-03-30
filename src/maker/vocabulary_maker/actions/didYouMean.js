"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.didYouMeanSuggestions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const format_1 = require("maker/vocabulary_maker/compile/format");
const string_similarity_1 = require("string-similarity");
const underscore_1 = __importDefault(require("underscore"));
let memoizedSuggestions = {};
const didYouMeanSuggestions = (is, input_row_id) => {
    if (memoizedSuggestions.row_id === input_row_id) {
        return memoizedSuggestions.value;
    }
    const split = is.toLowerCase().replace(/[.?!]/g, "").split(/[ ;,]/g);
    let similar = actions_1.Database.rows
        .map((r) => {
        if (r.icelandic === is)
            return null;
        const word = ">" +
            (r.icelandic + ">->" + r.alternative_id + ">->" + r.lemmas)
                .toLowerCase()
                .replace(/[.?!]/g, "")
                .split(/[ ;,]/g)
                .join(">") +
            ">";
        let score = 0;
        for (let i = 0; i < split.length; i++) {
            for (let b = i + 1; b <= split.length; b++) {
                const fragment = ">" + split.slice(i, b).join(">") + ">";
                // if (fragment.length < 3) continue;
                if (word.includes(fragment)) {
                    score += (b - i) * 2 + fragment.length;
                }
                else if (fragment.length > 6) {
                    const s = (0, string_similarity_1.compareTwoStrings)(fragment, word);
                    if (s > 0.2) {
                        score += (b - i) / 2 + s;
                    }
                }
                // if (r.icelandic === "Þetta er leiðinlegt.") {
                //   console.log({
                //     fragment,
                //     word,
                //     score,
                //     s: compareTwoStrings(fragment, word),
                //   });
                // }
            }
        }
        return Object.assign(Object.assign({}, r), { score });
    })
        .filter((j) => (j === null || j === void 0 ? void 0 : j.score) > 0)
        .sort((a, b) => b.score - a.score);
    const sentenceSplit = is.toLowerCase().split(/[;]/g);
    const dependsOnThis = actions_1.Database.rows
        .map((r) => {
        if (r.icelandic === is)
            return null;
        const i = `${r.lemmas || ""}; ${r.depends_on || ""}`
            .toLowerCase()
            .replaceAll("%", "")
            .split(/[;,]/g)
            .filter(Boolean)
            .map((i) => i.trim());
        if (underscore_1.default.intersection(i, sentenceSplit).length > 0) {
            return Object.assign(Object.assign({}, r), { score: r.icelandic.length });
        }
        return null;
    })
        .filter(Boolean)
        .sort((a, b) => a.level - b.level || a.score - b.score);
    // if (similar[0]?.score === similar[5]?.score) similar = [];
    if (dependsOnThis.length === 0 && similar.length === 0) {
        return null;
    }
    const u = underscore_1.default.uniq([...dependsOnThis.slice(0, 3), ...similar.slice(0, 3)], false, (row) => row.row_id).map((j, i) => ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: { cursor: "pointer" }, onClick: () => {
            // i.row_id
            const x = actions_1.Database.rows.findIndex((f) => f.row_id === j.row_id);
            const vals = actions_1.Database.rows[x];
            actions_1.Database.rows[x] = Object.assign(Object.assign({}, vals), { alternative_id: (vals.alternative_id || "") + ", " + is });
            (0, actions_1.delete_row)(input_row_id);
            // select(j.row_id);
        } }, { children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                __html: (0, format_1.formatVocabularyEntry)(j.icelandic),
            } }) }), i)));
    const returns = (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "small gray" }, { children: ["Did you mean: ", u] }));
    memoizedSuggestions = { row_id: input_row_id, value: returns };
    return returns;
};
exports.didYouMeanSuggestions = didYouMeanSuggestions;
