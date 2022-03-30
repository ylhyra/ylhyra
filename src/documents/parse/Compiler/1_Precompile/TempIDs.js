"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTempIDs = exports.TempIDs = void 0;
const shortid_1 = __importDefault(require("shortid"));
const seed = shortid_1.default.generate();
let i = 0;
const TempIDs = (input) => {
    if (!input)
        return input;
    const { attr, child } = input;
    const id = (attr === null || attr === void 0 ? void 0 : attr.id) || null;
    return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => (0, exports.TempIDs)(e)), attr: Object.assign(Object.assign({}, attr), { id: id || `temp__${seed}${i++}` }) });
};
exports.TempIDs = TempIDs;
const RemoveTempIDs = (input) => {
    if (!input)
        return input;
    const { attr, child } = input;
    let id = (attr === null || attr === void 0 ? void 0 : attr.id) || "";
    if (id.match(/^temp__/)) {
        id = null;
    }
    return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => (0, exports.RemoveTempIDs)(e)), attr: Object.assign(Object.assign({}, attr), { id }) });
};
exports.RemoveTempIDs = RemoveTempIDs;
