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
exports.changeMode = exports.addRowsIfMissing = exports.addEmpty = exports.findMissingDependencies = exports.save = exports.formatVocabularyData = exports.submit = exports.ignore_for_now = exports.delete_row = exports.selectNext = exports.select = exports.selectRows = exports.refreshRows = exports.MAX_PER_PAGE = exports.Database = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const isBrowser_1 = require("app/app/functions/isBrowser");
const log_1 = require("app/app/functions/log");
const store_1 = __importDefault(require("app/app/store"));
const search_1 = require("maker/vocabulary_maker/actions/search");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const rowTitles_1 = require("maker/vocabulary_maker/compile/rowTitles");
const underscore_1 = __importDefault(require("underscore"));
exports.Database = {
    maxID: 0,
    rows: [],
    sound: [],
    terms: {},
    cards: {},
    dependencies: {},
    alternative_ids: {},
    plaintext_sentences: {},
    selected_rows: [],
    // mode: "review_importance",
};
exports.MAX_PER_PAGE = 20;
const refreshRows = () => {
    if (exports.Database.mode === "review_importance") {
        exports.Database.rows = exports.Database.rows.sort((a, b) => Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
            Boolean(b.english) - Boolean(a.english) ||
            Boolean(b.icelandic) - Boolean(a.icelandic) ||
            ("difficulty" in a) - ("difficulty" in b) ||
            // a.last_seen?.localeCompare(b.last_seen) ||
            Boolean(a.fix) - Boolean(b.fix) ||
            (b.level <= 3) - (a.level <= 3) ||
            b.level - a.level ||
            false);
    }
    else {
        exports.Database.rows = exports.Database.rows.sort((a, b) => {
            var _a;
            return Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
                // Boolean(a.userLevel) - Boolean(b.userLevel) ||
                Boolean(a.icelandic) - Boolean(b.icelandic) ||
                Boolean(a.last_seen) - Boolean(b.last_seen) ||
                Boolean(a.english) - Boolean(b.english) ||
                ((_a = a.last_seen) === null || _a === void 0 ? void 0 : _a.localeCompare(b.last_seen)) ||
                (b.level <= 3) - (a.level <= 3) ||
                (a.level || 100) - (b.level || 100) ||
                a.row_id - b.row_id ||
                Boolean(a.fix) - Boolean(b.fix) ||
                false;
        });
    }
    (0, exports.selectRows)();
    (0, exports.select)(exports.Database.selected_rows.length > 0 && exports.Database.selected_rows[0].row_id);
};
exports.refreshRows = refreshRows;
const selectRows = (noupdate) => {
    if (!search_1.isSearching) {
        exports.Database.selected_rows = exports.Database.rows
            // .filter((i) => i.row_id > 1600 || i.userLevel <= 3 || !i.userLevel)
            // .filter((r) => !r.last_seen && !r["eyða"])
            .slice(0, exports.MAX_PER_PAGE);
    }
    else if (!noupdate) {
        exports.Database.selected_rows = [
            ...exports.Database.rows.filter((j) => !j.icelandic),
            ...exports.Database.selected_rows
                .map((s) => exports.Database.rows.find((j) => j.row_id === s.row_id))
                .filter(Boolean),
        ];
    }
    store_1.default.dispatch({
        type: "LOAD_VOCABULARY_MAKER_DATA",
        content: exports.Database.selected_rows,
    });
};
exports.selectRows = selectRows;
const select = (id) => {
    if (id) {
        store_1.default.dispatch({
            type: "VOCABULARY_MAKER_SELECT",
            content: id,
        });
        setTimeout(() => {
            if (!document.querySelector("form"))
                return;
            window.scroll(0, document.querySelector("form").offsetTop +
                document.querySelector("#content").offsetTop);
        }, 120);
    }
    else {
        store_1.default.dispatch({
            type: "VOCABULARY_MAKER_SELECT",
            content: null,
        });
    }
};
exports.select = select;
const selectNext = (row_id) => {
    const x = exports.Database.selected_rows[exports.Database.selected_rows.findIndex((j) => j.row_id === row_id) + 1];
    if (x === null || x === void 0 ? void 0 : x.row_id) {
        (0, exports.select)(x.row_id);
    }
    else {
        (0, search_1.turnOffSearch)();
        (0, exports.refreshRows)();
    }
};
exports.selectNext = selectNext;
const delete_row = (row_id) => {
    (0, exports.selectNext)(row_id);
    exports.Database.rows.splice(exports.Database.rows.findIndex((j) => j.row_id === row_id), 1);
    updateInterface();
    (0, exports.save)();
    // ignore_for_now(row_id, "DELETED");
};
exports.delete_row = delete_row;
const ignore_for_now = (row_id, message) => {
    const v = exports.Database.rows.findIndex((j) => j.row_id === row_id);
    exports.Database.rows[v] = Object.assign(Object.assign({}, exports.Database.rows[v]), { eyða: message || "IGNORED" });
    (0, exports.selectNext)(row_id);
    (0, exports.save)();
};
exports.ignore_for_now = ignore_for_now;
const submit = (vals, gotonext = true) => {
    vals = (0, exports.formatVocabularyData)(vals);
    exports.Database.rows[exports.Database.rows.findIndex((j) => j.row_id === vals.row_id)] = Object.assign(Object.assign({}, vals), { last_seen: new Date().toISOString().substring(0, 10) });
    updateInterface();
    // select(null);
    if (gotonext) {
        (0, exports.selectNext)(vals.row_id);
        (0, exports.save)();
    }
};
exports.submit = submit;
const formatVocabularyData = (vals) => {
    Object.keys(rowTitles_1.row_info).forEach((row_name) => {
        if (rowTitles_1.row_info[row_name].isNumber && vals[row_name]) {
            vals[row_name] = parseInt(vals[row_name]);
        }
    });
    return vals;
};
exports.formatVocabularyData = formatVocabularyData;
const updateInterface = () => {
    (0, exports.selectRows)();
    // store.dispatch({
    //   type: "LOAD_VOCABULARY_MAKER_DATA",
    //   content: selected_rows,
    // });
};
const save = () => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.Database.rows.length < 1) {
        throw new Error("No rows");
    }
    yield axios_1.default.post(`/api/vocabulary_maker`, {
        data: {
            rows: exports.Database.rows,
            sound: exports.Database.sound,
        },
        deckName: (0, functions_1.getDeckName)(),
    });
    (0, log_1.log)("Saved");
});
exports.save = save;
const findMissingDependencies = () => {
    let missing = [];
    Object.keys(exports.Database.dependencies).forEach((from_term) => {
        exports.Database.dependencies[from_term].forEach((to_term) => {
            if (!(to_term in exports.Database.terms) &&
                !(to_term in exports.Database.alternative_ids)) {
                missing.push(to_term);
            }
        });
    });
    missing = underscore_1.default.uniq(missing);
    console.log("Missing " + missing.length + " dependencies");
    // console.log({ missing: missing /*.join("\n")*/ });
    console.log({ missingDependencies: missing.join("\n") });
};
exports.findMissingDependencies = findMissingDependencies;
const addEmpty = () => {
    exports.Database.rows.push({
        row_id: exports.Database.maxID++ + 1,
        icelandic: document.querySelector("[name=search]").value,
    });
    (0, exports.refreshRows)();
    search_1.isSearching && (search_1.reDoSearch === null || search_1.reDoSearch === void 0 ? void 0 : (0, search_1.reDoSearch)());
};
exports.addEmpty = addEmpty;
const addRowsIfMissing = (text) => {
    let seen = [];
    let prompt_level = !(0, functions_1.getDeckName)() ? window.prompt("Level:") : null;
    text.split(/\n/g).forEach((row) => {
        if (!row || !row.trim())
            return;
        let [is, en, level, depends_on, lemmas] = row
            .replace(/^- /, "")
            .split(/(?: = |\t)/g);
        if ((0, functions_1.getDeckName)()) {
            is = is === null || is === void 0 ? void 0 : is.replace(/;+/g, ";;").replace(/,/g, ";");
            en = en === null || en === void 0 ? void 0 : en.replace(/;+/g, ";;").replace(/,/g, ";");
        }
        if (!((0, functions_1.getHash)(is) in exports.Database.terms) &&
            !((0, functions_1.getHash)(is) in exports.Database.alternative_ids) &&
            !exports.Database.rows.some((j) => j.icelandic === is) &&
            !seen.includes((0, functions_1.getHash)(is))) {
            exports.Database.rows.push({
                row_id: exports.Database.maxID++ + 1,
                icelandic: is.trim(),
                english: en === null || en === void 0 ? void 0 : en.trim(),
                alternative_id: is.trim(),
                // userLevel: DECK ? null : userLevel || window.term_level || 1,
                level: level || prompt_level || null,
                depends_on: depends_on || "",
                lemmas: lemmas || "",
            });
            console.log("added " + is);
            seen.push((0, functions_1.getHash)(is));
        }
    });
    // console.log(rows);
    (0, exports.save)();
    (0, exports.refreshRows)();
};
exports.addRowsIfMissing = addRowsIfMissing;
if (isBrowser_1.isBrowser) {
    window.addRowsIfMissing = exports.addRowsIfMissing;
    window.a = exports.addRowsIfMissing;
    window.save = exports.save;
    // window.rows = () => rows;
}
const changeMode = (e) => {
    const value = e.target.value;
    exports.Database.mode = value;
    (0, exports.refreshRows)();
    // if (value === "review_importance") {
    // }
};
exports.changeMode = changeMode;
