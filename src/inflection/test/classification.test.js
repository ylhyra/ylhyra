"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const BIN_classification_1 = __importDefault(require("inflection/tables/classification/BIN_classification"));
it("BÍN classification", () => {
    assert_1.default.deepEqual((0, BIN_classification_1.default)({ word_categories: "kvk", grammatical_tag: "FT-ÞF" })
        .inflectional_form_categories, ["plural", "accusative", "without definite article", 1]);
    assert_1.default.deepEqual((0, BIN_classification_1.default)({ word_categories: "kvk", grammatical_tag: "FT-ÞF2" })
        .inflectional_form_categories, ["plural", "accusative", "without definite article", 2]);
    assert_1.default.deepEqual((0, BIN_classification_1.default)({
        word_categories: "so",
        grammatical_tag: "GM-VH-ÞT-2P-ET2",
    }).inflectional_form_categories, ["active voice", "subjunctive", "past tense", "2nd person", "singular", 2]);
    // 'GM-NH-ÞT' í gætu   / 479125
    return;
});
