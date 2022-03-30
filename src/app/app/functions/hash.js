"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const string_hash_1 = __importDefault(require("string-hash"));
function default_1(input) {
    if (typeof input === "object") {
        input = (0, json_stable_stringify_1.default)(input);
    }
    else if (typeof input !== "string") {
        input = JSON.stringify(input);
    }
    return (0, string_hash_1.default)(input).toString(36);
}
exports.default = default_1;
