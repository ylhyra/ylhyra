"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const functions_1 = require("app/vocabulary/actions/functions");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const functions_2 = require("documents/compile/functions/functions");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class X extends react_1.Component {
    render() {
        const { cards } = this.props.data;
        if (cards.length === 0)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "vocabulary-header" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "simple-button", onClick: () => (0, functions_1.studyParticularIds)(cards) }, { children: "Study the words in this article" })), (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "gray" }, { children: " \u2013 " })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "" }, { children: [(0, jsx_runtime_1.jsxs)("b", { children: [(0, percentageKnown_1.PercentageKnown)(cards), "%"] }), " known"] }))] })));
    }
}
const VocabularyHeader = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    route: state.route,
}))(X);
exports.default = (props) => {
    return (0, jsx_runtime_1.jsx)(VocabularyHeader, { data: (0, functions_2.DecodeDataInHTML)(props.data) });
};
