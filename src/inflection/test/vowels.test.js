"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const vowels_1 = require("inflection/tables/functions/vowels");
it("splitOnVowelRegions", () => {
    assert_1.default.deepEqual((0, vowels_1.splitOnVowelRegions)("Kjartan"), ["K", "ja", "rt", "a", "n"]);
    assert_1.default.deepEqual((0, vowels_1.splitOnVowelRegions)("andrés"), ["", "a", "ndr", "é", "s"]);
    return;
});
it("removeLastVowelCluster", () => {
    assert_1.default.equal((0, vowels_1.removeLastVowelCluster)("syngja"), "syng");
    assert_1.default.equal((0, vowels_1.removeLastVowelCluster)("já"), "j");
    assert_1.default.equal((0, vowels_1.removeLastVowelCluster)("ja"), "");
    assert_1.default.equal((0, vowels_1.removeLastVowelCluster)("Kjartan"), "Kjartan");
    return;
});
