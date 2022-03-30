"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Suggestions_1 = require("maker/editor/Suggestions");
const List_1 = __importDefault(require("maker/editor/Suggestions/Views/List"));
const actions_1 = require("maker/editor/Translator/actions");
const SentenceTranslation_1 = __importDefault(require("maker/editor/Translator/Views/Document/SentenceTranslation"));
const Word_1 = __importDefault(require("maker/editor/Translator/Views/Document/Word"));
const Sidebar_1 = __importStar(require("maker/editor/Translator/Views/Sidebar/Sidebar"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class TranslatingEditor extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.checkKey = (e) => {
            // Escape
            if (e.keyCode === 27) {
                this.props.clearSelection();
            }
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.checkKey);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
    }
    render() {
        const { editor, selected } = this.props;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "translator-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "translator-content" }, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "translator-header" }, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: (0, jsx_runtime_1.jsx)("b", { children: "Shortcuts:" }) }), (0, jsx_runtime_1.jsx)("table", { children: (0, jsx_runtime_1.jsxs)("tbody", { children: [(0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("kbd", { children: "Click" }) }), (0, jsx_runtime_1.jsx)("td", { children: "Select word" })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("kbd", { children: "Alt" }), "+", (0, jsx_runtime_1.jsx)("kbd", { children: "Click" })] }), (0, jsx_runtime_1.jsx)("td", { children: "Add word" })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("kbd", { children: (0, Sidebar_1.isMacintosh)() ? "Cmd" : "Ctrl" }), "+", (0, jsx_runtime_1.jsx)("kbd", { children: "Click" })] }), (0, jsx_runtime_1.jsx)("td", { children: "Delete word" })] }), (0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: "2" }) }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("kbd", { children: "Enter" }) }), (0, jsx_runtime_1.jsx)("td", { children: "Next word" })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("kbd", { children: "Shift" }), "+", (0, jsx_runtime_1.jsx)("kbd", { children: "Enter" })] }), (0, jsx_runtime_1.jsx)("td", { children: "Add next word" })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("kbd", { children: "Alt+Enter" }) }), (0, jsx_runtime_1.jsx)("td", { children: "Previous word" })] }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("kbd", { children: "Alt+Shift" }), "+", (0, jsx_runtime_1.jsx)("kbd", { children: "Enter" })] }), (0, jsx_runtime_1.jsx)("td", { children: "Add previous word" })] })] }) }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: Suggestions_1.MakeSuggestions }, { children: "Get suggestions" })), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("small", Object.assign({ className: "editor-hide sysop-hide" }, { children: "Note: Machine translations are currently only available for verified editors" })) }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: Suggestions_1.applySuggestions }, { children: "Apply suggestions" }))] })] }) })), editor.tokenized.map((paragraph, index) => (
                            // Paragraph
                            (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "paragraph" }, { children: paragraph.sentences.map((sentence) => (
                                // Sentence
                                (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "sentence-container" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: sentence.words.map((word) => {
                                                // Word
                                                if (typeof word === "string") {
                                                    return word;
                                                }
                                                else {
                                                    return ((0, jsx_runtime_1.jsx)(Word_1.default, Object.assign({ id: word.id }, { children: word.text }), word.id));
                                                }
                                            }) }), (0, jsx_runtime_1.jsx)(SentenceTranslation_1.default, { id: sentence.id })] }), sentence.id))) }), index))), editor.parsed &&
                                editor.tokenized.length === 0 &&
                                `
              No text to translate. You can wrap paragraphs or phrases in <translate/> tags.
            `] }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "sidebar form" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "form" }, { children: [selected.length > 0 && (0, jsx_runtime_1.jsx)(List_1.default, {}), selected.length > 0 && (0, jsx_runtime_1.jsx)(Sidebar_1.default, {})] })) }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    editor: state.editor,
    translation: state.editor.translation,
    selected: state.editor.selected,
}), {
    clearSelection: actions_1.clearSelection,
})(TranslatingEditor);
