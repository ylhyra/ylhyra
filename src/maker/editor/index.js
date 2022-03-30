"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
const store_1 = __importDefault(require("app/app/store"));
const actions_1 = require("maker/editor/actions");
const Header_1 = __importDefault(require("maker/editor/Header"));
const Inflections_1 = __importDefault(require("maker/editor/Inflections"));
const Long_audio_1 = __importDefault(require("maker/editor/Long_audio"));
const Short_audio_1 = __importDefault(require("maker/editor/Short_audio"));
require("maker/editor/Style/index.styl");
const Translator_1 = __importDefault(require("maker/editor/Translator"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class _Editor extends react_1.default.PureComponent {
    // componentDidMount = () => {
    //
    // }
    render() {
        if (this.props.editor.open) {
            let View = Translator_1.default;
            if (this.props.editor.open === "sound") {
                View = Short_audio_1.default;
            }
            else if (this.props.editor.open === "long_audio") {
                View = Long_audio_1.default;
            }
            else if (this.props.editor.open === "inflections") {
                View = Inflections_1.default;
            }
            return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "editor" }, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)(View, {})] })));
        }
        else {
            return null;
        }
    }
}
const Editor = (0, react_redux_1.connect)((state) => ({
    editor: state.editor,
}))(_Editor);
const RenderEditor = () => {
    var _a;
    if (!isDev_1.isDev || !isBrowser_1.isBrowser)
        return null;
    if (!((_a = store_1.default.getState().editor.tokenized) === null || _a === void 0 ? void 0 : _a.length) > 0)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "editor-button", onClick: () => (0, actions_1.openEditor)("translate") }, { children: "Translate" })), (0, jsx_runtime_1.jsx)(Editor, {})] }));
    // document
    //   .querySelector("body")
    //   .insertAdjacentHTML(
    //     "beforeend",
    //     '<div id="editor-button-container"></div>'
    //   );
    //
    // let currentDocument = "blabla";
    //
    // ReactDOM.render(
    //   <Provider store={store}>
    //     <div>
    //       <div>
    //         {currentDocument ? (
    //           <button
    //             className="editor-button"
    //             onClick={() => openEditor("translate")}
    //           >
    //             Translate
    //           </button>
    //         ) : (
    //           `No text marked for translation.`
    //         )}
    //         <Editor />
    //       </div>
    //     </div>
    //   </Provider>,
    //   document.querySelector("#editor-button-container")
    // );
};
exports.default = RenderEditor;
