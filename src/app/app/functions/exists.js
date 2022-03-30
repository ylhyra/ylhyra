"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_empty_object_1 = __importDefault(require("is-empty-object"));
const exists = (input) => {
    return input !== null && input && !(0, is_empty_object_1.default)(input);
};
exports.default = exists;
