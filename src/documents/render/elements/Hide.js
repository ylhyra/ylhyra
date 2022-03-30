"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
class Hide extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "collapse" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "button", onClick: () => this.setState({ open: !this.state.open }) }, { children: this.state.open ? "Hide answer" : "Show answer" })), this.state.open && (0, jsx_runtime_1.jsx)("div", { children: this.props.children })] })));
    }
}
exports.default = Hide;
