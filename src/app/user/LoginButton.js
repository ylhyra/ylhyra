"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
const react_redux_1 = require("react-redux");
const Button = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "login-buttons" }, { children: props.user ? ((0, jsx_runtime_1.jsxs)(Link_1.default, Object.assign({ href: "/settings", className: "logged-in-as" }, { children: ["Logged in as", " ", (0, jsx_runtime_1.jsx)("b", { children: props.user.username.length > 20
                        ? props.user.username.slice(0, 15) + "..."
                        : props.user.username })] }))) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/login", className: "login" }, { children: "Log\u00A0in" })), (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/signup", className: "signup" }, { children: "Sign\u00A0up" }))] })) })));
};
exports.default = (0, react_redux_1.connect)((state) => ({
    user: state.user,
}))(Button);
