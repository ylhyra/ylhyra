"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const error_1 = __importDefault(require("app/app/error"));
const Footer_1 = __importDefault(require("app/elements/layout/Footer"));
const Header_1 = __importDefault(require("app/elements/layout/Header"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Layout extends react_1.default.Component {
    render() {
        const is_fullscreen = ["/vocabulary/play"].includes(this.props.pathname);
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "container" }, { children: [(0, jsx_runtime_1.jsx)(error_1.default, {}), !is_fullscreen && (0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ id: "content" }, { children: this.props.children })), !is_fullscreen && (0, jsx_runtime_1.jsx)(Footer_1.default, {})] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    pathname: state.route.pathname,
}))(Layout);
