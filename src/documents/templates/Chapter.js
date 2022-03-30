"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
const ChapterPercentage_1 = __importDefault(require("app/vocabulary/elements/InArticles/ChapterPercentage"));
const ChapterWords_1 = __importDefault(require("app/vocabulary/elements/InArticles/ChapterWords"));
const functions_1 = require("documents/compile/functions/functions");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class X extends react_1.Component {
    render() {
        // if (!this.props.vocabulary.deck) return null;
        const vocabulary = (0, functions_1.DecodeDataInHTML)(this.props.data);
        // console.log(vocabulary)
        return ((0, jsx_runtime_1.jsxs)(Link_1.default, Object.assign({ href: this.props.chapter_url, className: this.props.show_words ? "chapter" : "link-with-percentage" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "chapter-title" }, { children: [(0, jsx_runtime_1.jsx)("div", { children: this.props.children }), vocabulary && (0, jsx_runtime_1.jsx)(ChapterPercentage_1.default, { data: vocabulary })] })), this.props.show_words && ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "chapter-vocabulary-list" }, { children: vocabulary && (0, jsx_runtime_1.jsx)(ChapterWords_1.default, { data: vocabulary }) })))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    route: state.route,
}))(X);
