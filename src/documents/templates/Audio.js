"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const audio_1 = __importDefault(require("documents/render/audio"));
exports.default = (props) => (0, jsx_runtime_1.jsx)(audio_1.default, { src: props.src, inline: "inline" in props });
