"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const LoginForm_1 = __importDefault(require("app/user/LoginForm"));
exports.default = () => ((0, jsx_runtime_1.jsx)(LoginForm_1.default, { type: "login", above: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("h2", { children: "Log in" }) }) }));
