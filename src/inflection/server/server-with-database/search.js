"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Finds exact matches.
  For fuzzy matches, see ./autocomplete.js

  Note: This file currently relies on being a submodule of Ylhýra.
*/
const fuzzy_search_1 = __importDefault(require("inflection/server/server-with-database/fuzzy_search"));
const BIN_classification_1 = __importDefault(require("inflection/tables/classification/BIN_classification"));
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
// import { IcelandicCharacters } from 'inflection/tables/functions'
const IcelandicCharacters = /^[a-záéíóúýðþæö ]+$/i;
/*
  Find possible base words and tags for a given word
*/
exports.default = (options, callback) => {
    let { word, fuzzy, return_rows_if_only_one_match } = options;
    if (!word || word.length > 100 || !IcelandicCharacters.test(word)) {
        return callback(null);
        // return res.status(400).send({ error: 'Invalid string' })
    }
    word = word.trim().toLowerCase().replace(/\s+/g, " ");
    if (fuzzy) {
        return (0, fuzzy_search_1.default)({ word, return_rows_if_only_one_match }, callback);
    }
    else {
        (0, database_1.default)((0, SQL_template_literal_1.default) `
      SELECT BIN_id, base_word, inflectional_form, word_categories, grammatical_tag, should_be_taught FROM inflection
      WHERE inflectional_form_lowercase = ${word}
      ORDER BY
      should_be_taught DESC,
      correctness_grade_of_inflectional_form DESC
      LIMIT 100
    `, (err, results) => {
            if (err) {
                callback("Error");
            }
            else {
                let grouped = [];
                results.forEach((row) => {
                    let index = grouped.findIndex((i) => i.BIN_id === row.BIN_id);
                    if (index < 0) {
                        grouped.push({
                            BIN_id: row.BIN_id,
                            urls: {
                                nested: `https://ylhyra.is/api/inflection?id=${row.BIN_id}`,
                                flat: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=flat`,
                                html: `https://ylhyra.is/api/inflection?id=${row.BIN_id}&type=html`,
                            },
                            base_word: row.base_word,
                            word_categories: (0, BIN_classification_1.default)(row).word_categories,
                            matches: [],
                        });
                        index = grouped.length - 1;
                    }
                    grouped[index].matches.push({
                        inflectional_form: row.inflectional_form,
                        inflectional_form_categories: (0, BIN_classification_1.default)(row).inflectional_form_categories,
                        should_be_taught: row.should_be_taught,
                    });
                });
                callback(grouped);
            }
        });
    }
};
