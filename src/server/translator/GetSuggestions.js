"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flattenArray_1 = __importDefault(require("app/app/functions/flattenArray"));
const hash_1 = __importDefault(require("app/app/functions/hash"));
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const simplifyString_1 = __importDefault(require("server/translator/helpers/simplifyString"));
const TranslationFrame_1 = __importDefault(require("server/translator/helpers/TranslationFrame"));
const sqlstring_1 = require("sqlstring");
/*

  ____                              _   _
 / ___| _   _  __ _  __ _  ___  ___| |_(_) ___  _ __  ___
 \___ \| | | |/ _` |/ _` |/ _ \/ __| __| |/ _ \| '_ \/ __|
  ___) | |_| | (_| | (_| |  __/\__ \ |_| | (_) | | | \__ \
 |____/ \__,_|\__, |\__, |\___||___/\__|_|\___/|_| |_|___/
              |___/ |___/

  MySQL requests can easily become very large (Error: "max_allowed_packet").
  Request size is therefore limited.

  Todo:
  - Streamline
  - Take analysis into consideration

*/
const request = ({ list }) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let queries = [];
        for (let sentence_id of Object.keys(list.sentences)) {
            const sentence = list.sentences[sentence_id];
            /*
              Search sentences
            */
            if (typeof sentence !== "string" && sentence.id) {
                const text_hash = (0, hash_1.default)((0, simplifyString_1.default)(sentence.text));
                queries.push((0, SQL_template_literal_1.default) `
          SELECT ${sentence.id} as item_id, definition, definition_hash FROM (
            SELECT
              definitions.definition_hash,
              definitions.definition
              FROM words_and_sentences
              JOIN definitions
                ON words_and_sentences.definition_hash = definitions.definition_hash
              WHERE text_hash = ${text_hash}
                -- AND from_lang = ?
                -- AND to_lang = ?
            ) as inner_table
          GROUP BY definition_hash
          LIMIT 15;
        `);
            }
            /*
              Search words
            */
            sentence.words.forEach((word, index) => {
                if (typeof word === "string" || !word.id)
                    return;
                const text_hash = (0, hash_1.default)((0, simplifyString_1.default)(word.text));
                const translation_frame = (0, TranslationFrame_1.default)(sentence.words, index);
                // console.log(translation_frame)
                queries.push(`
          SELECT ${(0, sqlstring_1.escape)(word.id)} as item_id, definition, definition_hash, also_part_of_definition FROM (
            SELECT
              definitions.definition_hash,
              definitions.definition,

              # CONTAINS EVERYTHING IN DEFINITION
              (
                # REQUIRED NUMBER OF MATCHES
                SELECT count(*) FROM words_in_translation_frame
                  WHERE translation_frame_hash = t.translation_frame_hash
                    AND is_part_of_definition = TRUE
              ) = (
                # AMOUNT OF MATCHES
                SELECT count(*) FROM words_in_translation_frame
                  WHERE translation_frame_hash = t.translation_frame_hash
                  AND is_part_of_definition = TRUE
                  ${translation_frame.length > 0 &&
                    `
                    AND (
                      ${translation_frame
                        .map((frame) => `
                        (
                          word = ${(0, sqlstring_1.escape)(frame.text)}
                          AND position_relative_to_center_word = ${(0, sqlstring_1.escape)(frame.position_relative_to_center_word)}
                        )
                      `)
                        .join(" OR ")}
                    )`}
              ) as HAS_CORRECT_AMOUNT_OF_MATCHES,

              # SCORE
              (
                SELECT SUM(10 - ABS(position_relative_to_center_word))
                  FROM words_in_translation_frame
                  WHERE translation_frame_hash = t.translation_frame_hash
                  ${translation_frame.length > 0 &&
                    `
                    AND (
                      ${translation_frame
                        .map((frame) => `
                        (
                          word = ${(0, sqlstring_1.escape)(frame.text)}
                          AND position_relative_to_center_word = ${(0, sqlstring_1.escape)(frame.position_relative_to_center_word)}
                        )
                      `)
                        .join(" OR ")}
                    )`}
              ) as SCORE,

              (
                SELECT GROUP_CONCAT(position_relative_to_center_word SEPARATOR ',')
                  FROM words_in_translation_frame
                  WHERE translation_frame_hash = t.translation_frame_hash
                  AND is_part_of_definition = TRUE
                  AND position_relative_to_center_word != 0
              ) as also_part_of_definition

              FROM words_and_sentences
              JOIN translation_frames as t
                ON words_and_sentences.translation_frame_hash = t.translation_frame_hash
              JOIN definitions
                ON t.definition_hash = definitions.definition_hash
              WHERE text_hash = ${(0, sqlstring_1.escape)(text_hash)}
                -- AND from_lang = ?
                -- AND to_lang = ?
              HAVING HAS_CORRECT_AMOUNT_OF_MATCHES = TRUE
              ORDER BY SCORE
            ) as inner_table
          GROUP BY definition_hash
          LIMIT 15;
        `);
            });
        }
        // console.log(queries.join(''))
        let returns = [];
        yield queries.forEachAsync((q) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve2, reject2) => {
                (0, database_1.default)(q, (err, results) => {
                    if (err) {
                        console.error("Error in GetSuggestions.js:");
                        console.error(err);
                        reject2();
                    }
                    else {
                        results = (0, flattenArray_1.default)(results);
                        // console.log(JSON.stringify(results, null, 2))
                        returns.push(results);
                        resolve2();
                    }
                });
            });
        }));
        returns = (0, flattenArray_1.default)(returns);
        resolve(returns);
    }));
};
exports.default = request;
