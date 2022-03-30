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
const classification_1 = require("inflection/tables/classification/classification");
const link_1 = __importStar(require("inflection/tables/link"));
const render_table_1 = __importDefault(require("inflection/tables/render_table"));
const lodash_1 = require("lodash");
/**
 * Finds a single relevant table
 *
 * @module Word
 * @return {string} HTML as string
 */
function getSingleTable({ returnAsString, give_me, column_names, row_names, skip_description, }) {
    let word = this;
    let description = "";
    let table = "";
    if ((give_me === null || give_me === void 0 ? void 0 : give_me.length) > 0) {
        word = word.get(...give_me);
    }
    if (!column_names && !row_names) {
        /* Nouns */
        if (word.is("noun")) {
            row_names = classification_1.types["cases"];
        }
        else if (word.is("pronoun")) {
            row_names = classification_1.types["cases"];
        }
        else if (word.is("adjective")) {
            if (word.getFirst().is("nominative")) {
                if (word.getType("degree") === "positive degree") {
                    row_names = classification_1.types["genders"];
                }
                else {
                    row_names = classification_1.types["degree"];
                }
            }
            else {
                row_names = classification_1.types["cases"];
            }
        }
        else if (word.is("adverb") && word.getType("degree")) {
            row_names = classification_1.types["degree"];
        }
        else if (word.is("verb")) {
            /* Temp: Needs to be merged with the principalParts file */
            /* TODO: Support generation for miðmynd */
            const word2 = this.getOriginal();
            let principalParts = [
                word2.get("infinitive").getFirstClassification(),
                word2
                    .get(/*'indicative', */ "past tense", "1st person", "singular")
                    .getFirstClassification(),
                word2.isStrong() &&
                    word2
                        .get(/*'indicative',*/ "past tense", "1st person", "plural")
                        .getFirstClassification(),
                word2.get("supine").getFirstClassification(),
            ].filter(Boolean);
            row_names = principalParts;
            if ((give_me === null || give_me === void 0 ? void 0 : give_me.length) > 0) {
                /* The matched part is in the principal parts */
                if (principalParts.find((principalPart) => give_me.every((giveMeItem, index) => giveMeItem === principalPart[index]))) {
                    /* */
                }
                else {
                    // let row_names = ['infinitive']
                    // ['infinitive', relevant_word.getType('voice')].filter(Boolean),
                    if (word.getFirst().getType("person")) {
                        row_names = ["infinitive", ...classification_1.types["persons"]];
                    }
                    else {
                        /* Nothing but infinitive and word */
                        row_names = ["infinitive", give_me];
                    }
                    // if (relevant_word.getType('person')) {
                    //   row_names = [
                    //     ['infinitive', relevant_word.getType('voice')].filter(Boolean),
                    //     ...types['persons'],
                    //   ]
                    // }
                }
            }
        }
    }
    column_names = column_names || [null];
    row_names = row_names || [null];
    if ((give_me === null || give_me === void 0 ? void 0 : give_me.length) > 0) {
        word = word.get(...give_me);
    }
    else {
        word = word.getMeetingAny(...row_names, ...column_names);
    }
    // const sibling_classification = without(word.getFirstClassification(), ...flatten(row_names), ...flatten(column_names))
    // const siblings = word.getOriginal().get(sibling_classification)
    /* As string */
    if (returnAsString) {
        return row_names
            .map((c) => word.getMostRelevantSibling(c))
            .map((i) => i.getFirstAndItsVariants().render( /*{ highlight: give_me }*/))
            .filter(Boolean)
            .join(", ");
    }
    else {
        /* As table */
        /* TEMPORARY; MERGE WITH ABOVE */
        const sibling_classification = (0, lodash_1.without)(word.getFirstClassification(), ...(0, lodash_1.flatten)(row_names), ...(0, lodash_1.flatten)(column_names));
        const siblings = word.getOriginal().get(sibling_classification);
        table = (0, render_table_1.default)(siblings, word.getOriginal(), { column_names, row_names }, give_me, {
            linkWords: true,
        });
        description = (0, link_1.ucfirst_link)(sibling_classification.map((i) => (0, link_1.default)(i)).join(", "));
        let output;
        if (description && !skip_description) {
            output = `
        ${word.renderBaseWord()}
        <div class="word_description">${word.getWordDescription()}</div>
        ${description}
        ${table}
        `;
        }
        else {
            output = table;
        }
        // <a href="https://inflections.ylhyra.is/${encodeURIComponent(
        //   word.getBaseWord()
        // )}/${word.getId()}">Show all</a>
        return (output +
            `
        <div class="table-below">
          <div class="license-small">
            <div><a href="https://ylhyra.is/project/inflections">&copy; BÍN</a></div>
          </div>
        </div>
      `);
    }
}
exports.default = getSingleTable;
