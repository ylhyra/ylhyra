"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Greynir_parse_1 = __importDefault(require("server/grammatical-analysis/icelandic/Greynir-parse"));
const Greynir_request_1 = __importDefault(require("server/grammatical-analysis/icelandic/Greynir-request"));
function default_1(text, callback) {
    (0, Greynir_request_1.default)(text, (analysis) => {
        (0, Greynir_parse_1.default)(text, analysis, callback);
    });
}
exports.default = default_1;
