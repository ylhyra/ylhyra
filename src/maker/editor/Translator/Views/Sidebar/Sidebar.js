"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMacintosh = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/Translator/actions");
const Field_1 = __importDefault(require("maker/editor/Translator/Views/Sidebar/Field"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
// import { getLanguage } from 'server/datasets/languages'
class WordSidebar extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.focus = () => {
            window.setTimeout(() => {
                const element = document.getElementById("meaning");
                element.focus();
                element.select();
            }, 0);
        };
        this.checkKey = (e) => {
            // Cmd + D
            if ((e.metaKey || e.ctrlKey) && e.key === "d") {
                document.querySelector('[name="difficult"]').click();
                e.preventDefault();
            }
            // Cmd + I
            else if ((e.metaKey || e.ctrlKey) && e.key === "i") {
                document.querySelector('[name="show_definition_above"]').click();
                e.preventDefault();
            }
            // Escape
            else if (e.keyCode === 27) {
                this.props.clearSelection();
            }
            // Enter
            else if (e.keyCode === 13) {
                if (e.altKey) {
                    this.props.nextWord("previous", e.shiftKey);
                }
                else {
                    this.props.nextWord("next", e.shiftKey);
                }
            }
        };
        this.componentDidUpdate = (prevProps) => {
            if (prevProps.selected !== this.props.selected) {
                this.focus();
                // this.analysis()
            }
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.checkKey);
        this.focus();
        // this.analysis()
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
    }
    render() {
        const { selected, translation } = this.props;
        // const { chosen_words } = this.state
        const definition = translation.definitions[(0, actions_1.wordsHash)(selected)] || {};
        return [
            // <div className="form" style={{display: 'flex', flexDirection: 'column', minHeight: '100%'}}>
            /*
               _____ _     _                              _
              |_   _| |__ (_)___   __      _____  _ __ __| |
                | | | '_ \| / __|  \ \ /\ / / _ \| '__/ _` |
                | | | | | | \__ \   \ V  V / (_) | | | (_| |
                |_| |_| |_|_|___/    \_/\_/ \___/|_|  \__,_|
            */
            (0, jsx_runtime_1.jsxs)("section", { children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)(Field_1.default, { name: "difficult", component: "input", type: "checkbox" }), " Difficult word (make gray) ", (0, jsx_runtime_1.jsxs)("kbd", { children: [(0, exports.isMacintosh)() ? "Cmd" : "Ctrl", "+D"] })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)(Field_1.default, { name: "show_definition_above", component: "input", type: "checkbox" }), " ", "Show inline translation ", (0, jsx_runtime_1.jsxs)("kbd", { children: [(0, exports.isMacintosh)() ? "Cmd" : "Ctrl", "+I"] })] }), definition.show_definition_above && ((0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Translation to be shown:" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "inline_translation", component: "input", type: "text", placeholder: definition.meaning })] }))] }, "1"),
            (0, jsx_runtime_1.jsxs)("section", Object.assign({ style: { flex: 1 } }, { children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Meaning" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "meaning", component: "input", type: "text", id: "meaning" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Direct translation" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "direct", component: "input", type: "text" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Note" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "note", component: "input", type: "text" })] })] }), "2"),
            /*
              ____                                          _
             | __ )  __ _ ___  ___   __      _____  _ __ __| |
             |  _ \ / _` / __|/ _ \  \ \ /\ / / _ \| '__/ _` |
             | |_) | (_| \__ \  __/   \ V  V / (_) | | | (_| |
             |____/ \__,_|___/\___|    \_/\_/ \___/|_|  \__,_|
            */
            (0, jsx_runtime_1.jsxs)("section", Object.assign({ className: "gray" }, { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Base word" }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Base word" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "base", component: "input", type: "text" /*placeholder={chosen_words}*/ })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Meaning" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "base_meaning", component: "input", type: "text", placeholder: definition.meaning })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Direct translation" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "base_direct", component: "input", type: "text", placeholder: definition.direct })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Note" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "base_note", component: "input", type: "text" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Grammatical analysis" }), (0, jsx_runtime_1.jsx)(Field_1.default, { name: "grammatical_analysis", component: "input", type: "text", placeholder: definition.grammatical_analysis })] })] }), "3"),
        ];
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    editor: state.editor,
    translation: state.editor.translation,
    selected: state.editor.selected,
    metadata: state.editor.metadata,
    // analysis: state.translatorSelection.analysis,
    // beygingar: state.translatorSelection.beygingar,
    // beygingarRaw: state.translatorSelection.beygingarRaw,
}), {
    clearSelection: actions_1.clearSelection,
    nextWord: actions_1.nextWord,
    updateDefinitionValue: actions_1.updateDefinitionValue,
})(WordSidebar);
const isMacintosh = () => navigator.platform.indexOf("Mac") > -1;
exports.isMacintosh = isMacintosh;
