"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const functions_1 = require("app/vocabulary/actions/card/functions");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class X extends react_1.Component {
    render() {
        if (!this.props.vocabulary.deck)
            return null;
        // logMissing(this.props.data.missing);
        return ((0, jsx_runtime_1.jsxs)("small", Object.assign({ className: "percentage-known sans-serif" }, { children: [(0, percentageKnown_1.PercentageKnown)((0, functions_1.getCardIdsFromTermIds)(this.props.data.terms)), "% known"] }), 1));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    route: state.route,
}))(X);
