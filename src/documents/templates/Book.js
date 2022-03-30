"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const audio_1 = __importDefault(require("documents/render/audio"));
const Spacer_1 = __importDefault(require("documents/templates/Spacer"));
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "book", "data-translate": "true" }, { children: [(0, jsx_runtime_1.jsx)(Spacer_1.default, { space: 20 }), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "center" }, { children: props.audio && (0, jsx_runtime_1.jsx)(audio_1.default, { src: props.audio }) })), (0, jsx_runtime_1.jsx)(Spacer_1.default, { space: 10 }), props.children] })));
};
