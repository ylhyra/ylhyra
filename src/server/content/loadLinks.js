"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = exports._links = void 0;
const fs_1 = __importDefault(require("fs"));
exports._links = {};
try {
    exports._links = JSON.parse(fs_1.default.readFileSync(__basedir + `/build/links.json`, "utf8"));
}
catch (_a) { }
exports.links = exports._links;
