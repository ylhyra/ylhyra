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
exports.WordFromTree = void 0;
const BIN_classification_1 = require("inflection/tables/classification/BIN_classification");
const classification_1 = require("inflection/tables/classification/classification");
const discard_1 = require("inflection/tables/functions/discard");
const helperWords_1 = require("inflection/tables/functions/helperWords");
const irregularities_1 = require("inflection/tables/functions/irregularities");
const principalParts_1 = require("inflection/tables/functions/principalParts");
const stem_1 = require("inflection/tables/functions/stem");
const strong_1 = require("inflection/tables/functions/strong");
const wordDescription_1 = require("inflection/tables/functions/wordDescription");
const wordNotes_1 = require("inflection/tables/functions/wordNotes");
const tables_all_1 = __importDefault(require("inflection/tables/tables_all"));
const tables_single_1 = __importDefault(require("inflection/tables/tables_single"));
const tree_1 = __importStar(require("inflection/tables/tree"));
const lodash_1 = require("lodash");
class Word {
    /**
     * @param {array} rows
     * @param {Word=} original
     */
    constructor(rows, original) {
        if (!Array.isArray(rows) && rows !== undefined) {
            // console.log(rows)
            throw new Error(`Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`);
        }
        rows = rows || [];
        /* Test for broken input */
        if (!original) {
            if (!rows.every((row) => {
                return (typeof row === "object" && "inflectional_form_categories" in row);
            }))
                throw new Error("Malformed input to Word");
        }
        rows = (0, discard_1.discardUnnecessaryForms)(rows);
        this.rows = rows;
        if (original instanceof Word) {
            this.original = original.original;
        }
        else if (original) {
            // console.log(original)
            throw new Error("Expected original to be a Word");
        }
        else {
            this.original = this;
        }
        if (rows && !original) {
            if (this.rows.length === 0) {
                if (process.env.NODE_ENV === "development") {
                    throw new Error("Word created with empty rows");
                }
            }
            this.setup();
            // console.log(this.rows.map(r => r.formattedOutput))
        }
    }
    setup() {
        // console.log(this.rows[0])
        if ("alreadySetup" in this) {
            throw new Error("Has already been set up");
        }
        this.FindIrregularities();
        this.alreadySetup = true;
    }
    /* temp */
    highlight(input_string) {
        if (!input_string)
            return this;
    }
    getId() {
        return this.original.rows.length > 0 && this.original.rows[0].BIN_id;
    }
    getURL() {
        return `https://inflections.ylhyra.is/${encodeURIComponent(this.getBaseWord())}/${this.getId()}`;
    }
    getBaseWord() {
        return ((this.original.rows.length > 0 && this.original.rows[0].base_word) || "");
    }
    renderBaseWord() {
        return `<h4 class="base_word">
      ${this.is("verb") ? `<span class=gray>að</span>` : ""}
      ${this.getBaseWord()}
    </h4>`;
    }
    getIsWordIrregular() {
        return this.original.wordIsIrregular;
    }
    getWordHasUmlaut() {
        return this.original.wordHasUmlaut;
    }
    /**
     * @param  {array|...string} values
     */
    is(...values) {
        values = (0, lodash_1.flatten)(values);
        return values.every((value) => {
            /* Test word_categories */
            if (this.getWordCategories().includes((0, classification_1.normalizeTag)(value))) {
                return true;
            }
            /* Test inflectional_form_categories */
            return (this.rows.length > 0 &&
                this.rows.every((row) => row.inflectional_form_categories.includes((0, classification_1.normalizeTag)(value))));
        });
    }
    /**
     * @param  {array|...string} values
     */
    isAny(...values) {
        values = (0, lodash_1.flatten)(values);
        return values.some((value) => {
            /* Test word_categories */
            if (this.getWordCategories().includes((0, classification_1.normalizeTag)(value))) {
                return true;
            }
            /* Test inflectional_form_categories */
            return (this.rows.length > 0 &&
                this.rows.every((row) => row.inflectional_form_categories.includes((0, classification_1.normalizeTag)(value))));
        });
    }
    /**
     * @param  {array|...string} values
     */
    get(...values) {
        if (!values)
            return this;
        values = (0, lodash_1.flatten)(values);
        return new Word(this.rows.filter((row) => values.filter(Boolean).every((value) => row.inflectional_form_categories.includes((0, classification_1.normalizeTag)(value))
        // || row.word_categories.includes(value) // Should not be needed
        )), this);
    }
    /**
     * Used in string table generation
     */
    getMostRelevantSibling(...values) {
        if (!values)
            return this;
        values = (0, lodash_1.flatten)(values);
        let values_types = values.map((v) => { var _a; return (_a = (0, classification_1.getTagInfo)(v)) === null || _a === void 0 ? void 0 : _a.type; });
        let try_to_match_as_many_as_possible = [];
        this.getFirstClassification().forEach((c) => {
            let relevant_type_index = values_types.findIndex((v) => v === (0, classification_1.getTagInfo)(c).type);
            if (relevant_type_index >= 0) {
                try_to_match_as_many_as_possible.push(values[relevant_type_index]);
            }
            else {
                try_to_match_as_many_as_possible.push(c);
            }
        });
        let possible_rows = this.getOriginal()
            .rows.map((row) => {
            if (!values.every((j) => row.inflectional_form_categories.includes(j))) {
                // console.log({values,in:row.inflectional_form_categories})
                return null;
            }
            let match_score = 0;
            row.inflectional_form_categories.forEach((cat) => {
                if (try_to_match_as_many_as_possible.includes(cat)) {
                    match_score++;
                }
            });
            return {
                inflectional_form_categories: row.inflectional_form_categories,
                match_score,
            };
        })
            .filter(Boolean);
        if (possible_rows.length > 0) {
            let best_match = possible_rows
                .sort((a, b) => b.match_score - a.match_score)[0]
                .inflectional_form_categories.filter((i) => !(0, tree_1.isNumber)(i));
            // console.log({best_match,values})
            return this.getOriginal().get(best_match);
        }
        else {
            // console.log({values,try_to_match_as_many_as_possible})
            return this.returnEmptyWord();
        }
    }
    returnEmptyWord() {
        return new Word([], this);
    }
    /**
     * Returns all that meet *any* of the input values
     * @param  {array|...string} values
     */
    getMeetingAny(...values) {
        if (!values)
            return this;
        values = (0, lodash_1.flatten)(values);
        if (values.filter(Boolean).length === 0)
            return this;
        return new Word(this.rows.filter((row) => values
            .filter(Boolean)
            .some((value) => row.inflectional_form_categories.includes((0, classification_1.normalizeTag)(value)))), this);
    }
    getOriginal() {
        if (this.original.rows.length === 0)
            throw new Error("Empty original");
        return this.original;
    }
    getFirst() {
        return new Word(this.rows.slice(0, 1), this);
    }
    getFirstAndItsVariants() {
        /* We make sure the categories are completely equal to prevent
         * verbs (which come in various deep nestings) from matching */
        let match = this.getFirstClassification();
        return new Word(this.rows.filter((row) => match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
            match.every((value, index) => value === row.inflectional_form_categories[index])), this);
    }
    getFirstValue() {
        return ((this.rows.length > 0 && this.rows[0].inflectional_form) || undefined);
    }
    getFirstValueRendered() {
        return (this.rows.length > 0 && this.rows[0].formattedOutput) || undefined;
    }
    getForms() {
        return this.rows.map((row) => row.inflectional_form);
    }
    getForms_describe_as_string__temp() {
        return this.rows
            .map((row) => `${row.inflectional_form} ${row.inflectional_form_categories.join(",")}`)
            .join("\n");
    }
    getWordCategories() {
        var _a;
        return ((_a = this.original.rows[0]) === null || _a === void 0 ? void 0 : _a.word_categories) || [];
    }
    getFirstClassification() {
        return ((this.rows.length > 0 &&
            this.rows[0].inflectional_form_categories.filter((i) => !(0, tree_1.isNumber)(i))) ||
            []);
    }
    /**
     * @param  {array|...string} values
     */
    without(...values) {
        values = (0, lodash_1.flatten)(values);
        return new Word(this.rows.filter((row) => values
            .filter(Boolean)
            .every((value) => !row.inflectional_form_categories.includes((0, classification_1.normalizeTag)(value)))), this);
    }
    /**
     * Used to ask "which case does this word have?"
     * E.g. getType('case') returns 'nominative'
     *
     * @param  {string} type
     * @return {?string}
     */
    getType(type) {
        const classification = [
            ...this.getWordCategories(),
            // TODO: Should we get first class or that which applies to all?
            ...this.getFirstClassification(),
        ];
        let relevantTypes = classification_1.types[type];
        if (!relevantTypes)
            return;
        return classification.find((i) => relevantTypes.includes(i));
    }
    getDomain() {
        return (this.rows.length > 0 && BIN_classification_1.relevant_BIN_domains[this.rows[0].BIN_domain]);
        // console.log(this.getFirst())
    }
    /**
     * Three values are inputted, a value is returned
     * based on the gender of the word.
     * Used when generating helper words
     * @param  {...*} values
     */
    dependingOnGender(...values) {
        return values[["masculine", "feminine", "neuter"].indexOf(this.getType("gender"))];
    }
    /**
     * Five values are inputted, a value is returned
     * based on the subject type of the verb
     * Used when generating helper words
     * @param  {...*} values
     */
    dependingOnSubject(...values) {
        if (this.is("impersonal with accusative subject")) {
            return values[1];
        }
        else if (this.is("impersonal with dative subject")) {
            return values[2];
        }
        else if (this.is("impersonal with genitive subject")) {
            return values[3];
        }
        else if (this.is("impersonal with dummy subject")) {
            return values[4];
        }
        else {
            return values[0];
        }
    }
    getRows() {
        return this.rows;
    }
    getTree() {
        return (0, tree_1.default)(this.rows);
    }
    /* Returns array */
    renderForms() {
        return this.rows.map((row) => {
            /* formattedOutput contains umlaut higlights */
            let out = row.formattedOutput || row.inflectional_form;
            if (row.matched_term === row.inflectional_form) {
                out = `<span class="highlight">${out}</span>`;
            }
            return out;
        });
    }
    /* Returns string with helper words */
    render() {
        let output = this.getHelperWordsBefore() +
            " " +
            this.renderForms()
                .map((i) => `<b>${i}</b>`)
                .join(" / ") +
            this.getHelperWordsAfter();
        output = output.trim();
        // const highlight = options?.highlight
        // if (highlight && this.is(highlight)) {
        //   output = `<span class="highlight">${output}</span>`
        // }
        return output;
    }
    /**
      A snippet is a short example of a conjugation to display in search results
    */
    getSnippet() {
        // if (this.is('verb')) {
        //   return this.getPrincipalParts()
        // }
        /* Which variant to highlight? */
        let chosen_variant_to_show = [];
        let variants_matched = [];
        this.rows.forEach((row) => {
            if (row.variant_matched) {
                variants_matched.push(row);
            }
        });
        variants_matched = variants_matched.sort((a, b) => {
            return (b.should_be_taught +
                b.correctness_grade_of_inflectional_form +
                b.correctness_grade_of_word -
                (a.should_be_taught +
                    a.correctness_grade_of_inflectional_form +
                    a.correctness_grade_of_word));
        });
        if (variants_matched.length > 0) {
            chosen_variant_to_show =
                variants_matched[0].inflectional_form_categories.filter((i) => !(0, tree_1.isNumber)(i));
        }
        return this.getSingleTable({
            returnAsString: true,
            give_me: chosen_variant_to_show,
        });
    }
}
const WordFromTree = (input, original) => {
    let rows = [];
    const traverse = (x) => {
        if (Array.isArray(x)) {
            x.map(traverse);
        }
        else if (x.values) {
            x.values.map(traverse);
        }
        else {
            rows.push(x);
        }
    };
    traverse(input);
    return new Word(rows, original);
};
exports.WordFromTree = WordFromTree;
Word.prototype.getHelperWordsBefore = helperWords_1.getHelperWordsBefore;
Word.prototype.getHelperWordsAfter = helperWords_1.getHelperWordsAfter;
Word.prototype.getPrincipalParts = principalParts_1.getPrincipalParts;
Word.prototype.getStem = stem_1.getStem;
Word.prototype.isStrong = strong_1.isStrong;
Word.prototype.isWeak = strong_1.isWeak;
Word.prototype.getTables = tables_all_1.default;
Word.prototype.getSingleTable = tables_single_1.default;
Word.prototype.getWordDescription = wordDescription_1.getWordDescription;
Word.prototype.getWordNotes = wordNotes_1.getWordNotes;
Word.prototype.FindIrregularities = irregularities_1.FindIrregularities;
exports.default = Word;
