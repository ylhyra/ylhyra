"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnOffSearch = exports.search = exports.reDoSearch = exports.isSearching = void 0;
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const format_1 = require("maker/vocabulary_maker/compile/format");
exports.isSearching = false;
const search = (e) => {
    (0, actions_1.select)(null);
    exports.reDoSearch = () => {
        (0, exports.search)(e);
    };
    // if (e.keyCode !== 13 /* Enter */) return;
    const text = e.target.value.trim();
    if (!text) {
        exports.isSearching = false;
    }
    else {
        exports.isSearching = true;
        actions_1.Database.selected_rows = actions_1.Database.rows
            .filter((j) => !j.icelandic ||
            new RegExp(text, "i").test([
                (0, format_1.getPlaintextFromVocabularyEntry)(j.icelandic),
                (0, format_1.getPlaintextFromVocabularyEntry)(j.english),
                j.lemmas,
                j.depends_on,
                j.note,
                j.alternative_id,
                j.note_regarding_english,
                j.related_items,
                j["this is a minor variation of"],
            ].join(" ")))
            .sort((a, b) => { var _a, _b; return ((_a = a.icelandic) === null || _a === void 0 ? void 0 : _a.length) - ((_b = b.icelandic) === null || _b === void 0 ? void 0 : _b.length); });
    }
    (0, actions_1.selectRows)(true);
};
exports.search = search;
const turnOffSearch = () => {
    exports.isSearching = false;
};
exports.turnOffSearch = turnOffSearch;
