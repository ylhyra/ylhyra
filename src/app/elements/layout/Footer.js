"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
exports.default = () => ((0, jsx_runtime_1.jsx)("div", Object.assign({ id: "footer" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "footer-info" }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "footer-gray" }, { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/about" }, { children: "About" })) })), "\u2022", (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "anonymous-show" }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "footer-gray" }, { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "https://inflections.ylhyra.is/" }, { children: "Look up inflections" })) })), "\u2022", (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "footer-gray" }, { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: "mailto:ylhyra@ylhyra.is" }, { children: "Report\u00A0errors" })) })), (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "pwyw-on" }, { children: ["\u2022", (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "footer-gray" }, { children: (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/donate" }, { children: "Donate" })) }))] }))] }))] })) })));
