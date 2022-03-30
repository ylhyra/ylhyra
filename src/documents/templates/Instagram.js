"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const paths_1 = require("app/app/paths");
const audio_1 = __importDefault(require("documents/render/audio"));
const audio_2 = __importDefault(require("documents/render/audio"));
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "video-container" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "video-header" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: (0, paths_1.getDynamicFileUrl)(props.user_image), width: "40", alt: "" }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "video-author" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "video-username" }, { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: props.url }, { children: props.user_name })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "video-handle" }, { children: (0, jsx_runtime_1.jsxs)("a", Object.assign({ href: props.url }, { children: ["@", props.user_handle] })) }))] }))] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "video" }, { children: (0, jsx_runtime_1.jsx)(audio_2.default, { type: "video", src: props.file, autoplay: "true" }) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "video-sidebar" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "video-sidebar-content" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ "data-translate": "true" }, { children: [props.audio && (0, jsx_runtime_1.jsx)(audio_1.default, { src: props.audio, label: "Slow audio" }), props.children] })) })) }))] })));
};
