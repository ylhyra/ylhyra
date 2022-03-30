"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordDescription = void 0;
const link_1 = __importDefault(require("inflection/tables/link"));
/**
 * @module Word
 * @return {?string}
 */
function getWordDescription() {
    let output = [];
    output.push(this.getDomain());
    output.push(
    /* Gender for nouns */
    (this.is("noun") ? (0, link_1.default)(this.getType("gender")) + " " : "") +
        /* Word class */
        (0, link_1.default)(this.getType("class")));
    const isStrong = this.isStrong();
    if (isStrong === true) {
        output.push((0, link_1.default)("strongly conjugated"));
    }
    else if (isStrong === false) {
        output.push((0, link_1.default)("weakly conjugated"));
    }
    if (this.getIsWordIrregular()) {
        output.push((0, link_1.default)("irregular inflection"));
    }
    if (this.getWordHasUmlaut()) {
        output.push((0, link_1.default)("includes a sound change"));
    }
    if (!this.is("indeclinable") &&
        this.getIsWordIrregular() === false &&
        this.getWordHasUmlaut() === false) {
        output.push((0, link_1.default)("regular inflection"));
    }
    output = output.filter(Boolean).join(", ");
    return output;
}
exports.getWordDescription = getWordDescription;
