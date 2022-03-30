"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class Progress extends react_1.Component {
    render() {
        var _a, _b;
        const percentageDone = (_b = (_a = this.props.vocabulary.deck) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.getPercentageDone();
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "vocabulary-progress" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "bar" }, { children: [(0, jsx_runtime_1.jsx)("div", { className: "part done", style: { flex: percentageDone } }), (0, jsx_runtime_1.jsx)("div", { className: "part remaining", style: { flex: 100 - percentageDone } })] })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
}))(Progress);
