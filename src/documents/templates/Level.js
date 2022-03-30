"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Link_1 = __importDefault(require("app/router/Link"));
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "level" }, { children: ["Level ", (0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: props.level }, { children: props.level.toUpperCase() }))] })));
};
