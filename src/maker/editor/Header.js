"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/actions");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class App extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => {
            // MakeSuggestions()
        };
    }
    render() {
        const { editor } = this.props;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "header" }, { children: [!editor.isSaved && (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: actions_1.save }, { children: "Save document" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: actions_1.closeEditor }, { children: "Close" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => (0, actions_1.openEditor)("translate") }, { children: "Translate" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => (0, actions_1.openEditor)("long_audio") }, { children: "Long audio" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => (0, actions_1.openEditor)("sound") }, { children: "Sound" }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    editor: state.editor,
}), {})(App);
