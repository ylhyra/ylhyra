"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class X extends react_1.Component {
    render() {
        var _a;
        const parts = parseInt(this.props.parts);
        const url = this.props.route.pathname;
        if (!url || url === "/") {
            console.error(`Part.js received url: ${url}`);
            return null;
        }
        const basename = url.replace(/\/(\d+)$/, "") + "/";
        const part = parseInt((_a = url.match(/\/(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1]) || 1;
        let array = [];
        for (let i = 1; i <= parts; i++) {
            array.push(i);
        }
        let next = part + 1 <= parts ? part + 1 : null;
        const f = (j) => basename + j.toString();
        return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "parts" }, { children: (0, jsx_runtime_1.jsxs)("ul", { children: [array.map((k, index) => ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: `numbers ${index === 0 ? "first" : ""}` }, { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: f(k) }, { children: k })) }), index))), next && ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: "next" }, { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: f(next) }, { children: "Next" })) })))] }) })) }));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
}))(X);
