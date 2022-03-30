"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ucfirst_1 = require("app/app/functions/ucfirst");
const classification_1 = require("inflection/tables/classification/classification");
const link_1 = __importDefault(require("inflection/tables/link"));
const render_table_1 = __importStar(require("inflection/tables/render_table"));
const tree_1 = require("inflection/tables/tree");
const word_1 = __importStar(require("inflection/tables/word"));
/**
 * getTables - Prints all tables for a given word
 *
 * @module Word
 * @return {string} HTML as string
 */
function getTables() {
    return TraverseTree(this.getTree(), this);
}
exports.default = getTables;
/**
 * TraverseTree - Recursively goes through the tree from ./tree.js and prints all tables
 *
 * @param {object} leaf - Leaf from ./tree.js on the form { tag: 'nominative', values: [] }
 * @param {Word} original_word
 * @return {string} HTML as string
 */
const TraverseTree = (leaf, original_word) => {
    let table = null;
    const word = (0, word_1.WordFromTree)(leaf, original_word);
    /* Nouns */
    if (word.is("noun") && classification_1.types["plurality"].includes(leaf.tag)) {
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: classification_1.types["article"],
            row_names: classification_1.types["cases"],
        });
    }
    else if (
    /* Pronouns */
    (word.is("pronoun") || word.is("article")) &&
        classification_1.types["plurality"].includes(leaf.tag)) {
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: classification_1.types["gender"],
            row_names: classification_1.types["cases"],
        });
    }
    else if (word.is("personal pronoun")) {
        /* Personal pronouns */
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: classification_1.types["plurality"],
            row_names: classification_1.types["cases"],
        });
    }
    else if (word.is("reflexive pronoun")) {
        /* Reflexive pronouns */
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: [null],
            row_names: classification_1.types["cases"],
        });
    }
    else if (
    /* Adjectives */
    (word.is("adjective") ||
        word.is("past participle") ||
        word.is("ordinal number") ||
        word.is("numeral")) &&
        classification_1.types["plurality"].includes(leaf.tag)) {
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: classification_1.types["gender"],
            row_names: classification_1.types["cases"],
        });
    }
    else if (
    /* Verbs */
    word.is("verb") &&
        classification_1.types["tense"].includes(leaf.tag) &&
        !word.is("question form") &&
        !word.is("infinitive")) {
        /* Dummy subjects */
        if (word.is("impersonal with dummy subject")) {
            table = (0, render_table_1.default)(leaf.values, original_word, {
                column_names: ["singular"],
                row_names: ["3rd person"],
            });
        }
        else {
            /* Regular table */
            table = (0, render_table_1.default)(leaf.values, original_word, {
                column_names: classification_1.types["plurality"],
                row_names: classification_1.types["person"],
            });
        }
    }
    else if (leaf.tag === "imperative") {
        /* Imperative */
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: [null],
            row_names: ["singular", "plural", "clipped imperative"],
        });
    }
    else if (word.is("question form") && classification_1.types["tense"].includes(leaf.tag)) {
        table = (0, render_table_1.default)(leaf.values, original_word, {
            column_names: classification_1.types["plurality"],
            row_names: ["2nd person"],
        });
    }
    let output = table;
    if (!output) {
        /*
          Go deeper
        */
        if (leaf.values && !LeafOnlyContainsVariants(leaf.values)) {
            output = leaf.values.map((i) => TraverseTree(i, original_word)).join("");
        }
        else {
            /*
            No table was created above,
            generate a simple field
          */
            let rows = leaf.values || [leaf]; /* For supine of "geta" */
            output = `<table class="table not-center"><tbody><tr>${(0, render_table_1.renderCell)(new word_1.default(rows, original_word))}</tr></tbody></table>`;
        }
    }
    if (leaf.tag) {
        return `<dl class="indent">
      <dt>${(0, link_1.default)((0, ucfirst_1.ucfirst)(leaf.tag))}</dt>
      <dd>${output}</dd>
    </dl>`;
    }
    else {
        return output;
    }
};
/**
 * If a leaf only contains a single form and its variants,
 * we want to be able to group them together.
 * Created to handle the supine of "geta".
 */
const LeafOnlyContainsVariants = (array) => {
    let first = array[0];
    if (!first || !first.inflectional_form_categories)
        return;
    let match = first.inflectional_form_categories.filter((i) => !(0, tree_1.isNumber)(i));
    return array.slice(1).every((row) => row.inflectional_form_categories &&
        match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
        match.every((value, index) => value === row.inflectional_form_categories[index]));
};
