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
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const initialize_1 = require("maker/vocabulary_maker/actions/initialize");
const search_1 = require("maker/vocabulary_maker/actions/search");
const format_1 = require("maker/vocabulary_maker/compile/format");
const rowTitles_1 = require("maker/vocabulary_maker/compile/rowTitles");
const Form_1 = __importDefault(require("maker/vocabulary_maker/Elements/Form"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class VocabularyMaker extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => __awaiter(this, void 0, void 0, function* () {
            (0, initialize_1.load)();
        });
    }
    render() {
        if (!this.props.vocabularyMaker.data)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "vocabulary_maker" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [actions_1.Database.rows.filter((r) => !r.last_seen && !r["eyða"]).length, " new remaining.", " ", actions_1.Database.rows.filter((r) => r.last_seen && !r["eyða"] && !r.english)
                            .length, " ", "old need translation."] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Mode:", (0, jsx_runtime_1.jsxs)("select", Object.assign({ name: "mode", onChange: actions_1.changeMode, defaultValue: actions_1.Database.mode }, { children: [(0, jsx_runtime_1.jsx)("option", Object.assign({ value: "" }, { children: "-" })), (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "review_importance" }, { children: "Review importance" }))] }))] }), (0, jsx_runtime_1.jsx)("input", { placeholder: "Search...", type: "text", name: "search", onKeyUp: search_1.search }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: actions_1.addEmpty }, { children: "Add" })), this.props.vocabularyMaker.data.map((row) => {
                    if (row.row_id === this.props.vocabularyMaker.selected) {
                        return (0, jsx_runtime_1.jsx)(Form_1.default, { row: row }, row.row_id);
                    }
                    else {
                        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `row ${row.last_seen ? "seen" : ""}`, onClick: () => (0, actions_1.select)(row.row_id) }, { children: [(0, jsx_runtime_1.jsx)("b", { dangerouslySetInnerHTML: {
                                        __html: (0, format_1.formatVocabularyEntry)(row.icelandic),
                                    } }), " ", "=", " ", (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, format_1.formatVocabularyEntry)(row.english),
                                    } }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "small gray" }, { children: rowTitles_1.row_titles.slice(2).map((row_name) => row[row_name] ? ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("b", { children: row_name }), ":", " ", (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                                    __html: (0, format_1.formatVocabularyEntry)(row[row_name]),
                                                } }), ",", " "] }, row_name)) : null) }))] }), row.row_id));
                    }
                })] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    vocabularyMaker: state.vocabularyMaker,
}))(VocabularyMaker);
