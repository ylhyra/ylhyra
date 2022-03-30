"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
const LoginForm_1 = __importDefault(require("app/user/LoginForm"));
exports.default = () => ((0, jsx_runtime_1.jsx)(LoginForm_1.default, { type: "login", above: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/signup" }, { children: "Sign up" })), (0, jsx_runtime_1.jsx)("h2", { children: "Log in" })] }) }));
