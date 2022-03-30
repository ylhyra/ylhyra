"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Traverse_1 = __importDefault(require("documents/render/Traverse"));
exports.default = ({ json, data }) => {
    return (0, Traverse_1.default)({ json, data, index: 0 }) || null;
};
