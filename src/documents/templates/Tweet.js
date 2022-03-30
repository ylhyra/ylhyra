"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const paths_1 = require("app/app/paths");
const audio_1 = __importDefault(require("documents/render/audio"));
const Image_1 = __importDefault(require("documents/templates/Image"));
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "tweet" }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "tweet-header" }, { children: [props.user_picture && ((0, jsx_runtime_1.jsx)("img", { src: (0, paths_1.getDynamicFileUrl)(props.user_picture), width: "50", alt: "" })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "tweet-author" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "tweet-username" }, { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: `https://twitter.com/${props.handle}/status/${props.id}` }, { children: props.user_name })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "tweet-handle" }, { children: (0, jsx_runtime_1.jsx)("a", Object.assign({ href: `https://twitter.com/${props.handle}/status/${props.id}` }, { children: props.handle })) }))] }))] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "tweet-text" }, { children: [props.audio && (0, jsx_runtime_1.jsx)(audio_1.default, { src: props.audio }), props.children] })), (0, jsx_runtime_1.jsxs)("div", { children: [props.photo1 && ((0, jsx_runtime_1.jsx)(Image_1.default, { src: props.photo1, position: props.photo, width: "300" })), props.photo2 && (0, jsx_runtime_1.jsx)(Image_1.default, { src: props.photo2, width: "300" }), props.photo3 && (0, jsx_runtime_1.jsx)(Image_1.default, { src: props.photo3, width: "300" }), props.photo4 && (0, jsx_runtime_1.jsx)(Image_1.default, { src: props.photo4, width: "300" })] })] })));
};
