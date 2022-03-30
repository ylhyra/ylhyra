"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = __importDefault(require("app/app/functions/hash"));
const database_1 = __importDefault(require("server/database"));
const simplifyString_1 = __importDefault(require("server/translator/helpers/simplifyString"));
const SQL_helper_1 = __importDefault(require("server/translator/helpers/SQL_helper"));
const TranslationFrame_1 = __importDefault(require("server/translator/helpers/TranslationFrame"));
const router = require("express").Router();
require("app/App/functions/sortByArray");
router.put("/save", (req, res) => {
    const { document_id, from, to, translation, list } = req.body.data;
    SaveTranslator({ document_id, from, to, translation, list });
    res.sendStatus(200);
});
/*

  ____                     _                       _       _   _
 / ___|  __ ___   _____   | |_ _ __ __ _ _ __  ___| | __ _| |_(_) ___  _ __  ___
 \___ \ / _` \ \ / / _ \  | __| '__/ _` | '_ \/ __| |/ _` | __| |/ _ \| '_ \/ __|
  ___) | (_| |\ V /  __/  | |_| | | (_| | | | \__ \ | (_| | |_| | (_) | | | \__ \
 |____/ \__,_| \_/ \___|   \__|_|  \__,_|_| |_|___/_|\__,_|\__|_|\___/|_| |_|___/


  Saves word and sentence translations in these tables:
    - words_and_sentences
    - translation_frames

  (Temp: Disregards analysis)

*/
const SaveTranslator = ({ document_id, from, to, translation, list }) => {
    var _a;
    if (!list)
        return;
    const SQL = new SQL_helper_1.default();
    /*
      Remove previously saved translations for this document
      (Temporary: Does not remove joins as
       they may be shared with others)
    */
    SQL.query([
        `
    DELETE w -- a,b,c,d
      FROM words_and_sentences as w
      WHERE w.document_id = ?;`,
        [document_id],
    ]);
    // # Svona á að eyða með joinum:
    // DELETE h.* FROM history h
    // LEFT JOIN customer c ON h.customer_id = c.id
    // WHERE c.id IS NULL
    // # Find unused translation frames
    // SELECT w2.translation_frame_hash -- * -- w -- a,b,c,d
    //   FROM words_and_sentences as w
    //   JOIN translation_frames as t
    //     ON t.translation_frame_hash = w.translation_frame_hash
    //   JOIN words_and_sentences as w2
    //     ON w2.translation_frame_hash != t.translation_frame_hash
    //   WHERE w.document_id = 16
    //   GROUP BY translation_frame_hash
    //   ;
    for (let sentence_id of Object.keys(list.sentences)) {
        const sentence = list.sentences[sentence_id];
        // TODO: Save sentence definition
        // const definition = translation.sentences[sentence_id]
        /*
          Save sentence
        */
        if (translation.sentences[sentence.id]) {
            const definition = translation.sentences[sentence.id];
            const definition_pure = __rest(definition, []);
            const text_hash = (0, hash_1.default)((0, simplifyString_1.default)(sentence.text));
            const definition_hash = (0, hash_1.default)(definition_pure);
            SQL.query([
                `
        INSERT INTO words_and_sentences SET
          from_lang = ?,
          to_lang = ?,
          text_hash = ?,
          definition_hash = ?,
          document_id = ?;`,
                [from, to, text_hash, definition_hash, document_id],
            ]);
            SQL.query([
                `
        INSERT IGNORE INTO definitions SET
          definition_hash = ?,
          definition = ?;
          `,
                [definition_hash, JSON.stringify(definition_pure)],
            ]);
        }
        /*
          Save words
        */
        (_a = sentence.words) === null || _a === void 0 ? void 0 : _a.forEach((word, index) => {
            if (typeof word === "string" || !word.id)
                return;
            if (translation.words[word.id]) {
                const definition = translation.definitions[translation.words[word.id]];
                if (!definition.contains)
                    return;
                // const text = definition.contains
                //   .sortByArray(arrayOfAllWordIDs)
                //   .map(i => {
                //     // console.log(words[i].analysis)
                //     return words[i].text
                //   })
                //   .join(' ')
                /*
                  "Contains" is just a list of ids. Here we remove it.
                */
                const { contains } = definition, definition_pure = __rest(definition, ["contains"]); // TODO copy to next file...
                const text_hash = (0, hash_1.default)((0, simplifyString_1.default)(word.text));
                const definition_hash = (0, hash_1.default)(definition_pure);
                const translation_frame = (0, TranslationFrame_1.default)(sentence.words, index, contains);
                const translation_frame_hash = (0, hash_1.default)(translation_frame);
                SQL.query([
                    `
          INSERT INTO words_and_sentences SET
            from_lang = ?,
            to_lang = ?,
            text_hash = ?,
            translation_frame_hash = ?,
            document_id = ?;`,
                    [from, to, text_hash, translation_frame_hash, document_id],
                ]);
                SQL.query([
                    `
          INSERT IGNORE INTO translation_frames SET
            translation_frame_hash = ?,
            definition_hash = ?;`,
                    [translation_frame_hash, definition_hash],
                ]);
                // TEMP (Ég ætti líklega að finna betri leið til að stimpla allt þetta inn...)
                SQL.query([
                    `
          DELETE w FROM words_in_translation_frame as w
          WHERE w.translation_frame_hash = ?;`,
                    [translation_frame_hash],
                ]);
                translation_frame.forEach((word_in_frame) => {
                    SQL.query([
                        `
            INSERT IGNORE INTO words_in_translation_frame SET
              translation_frame_hash = ?,
              position_relative_to_center_word = ?,
              word = ?,
              is_part_of_definition = ?;`,
                        [
                            translation_frame_hash,
                            word_in_frame.position_relative_to_center_word,
                            word_in_frame.text,
                            word_in_frame.is_part_of_definition,
                        ],
                    ]);
                });
                SQL.query([
                    `
          INSERT IGNORE INTO definitions SET
            definition_hash = ?,
            definition = ?;
            `,
                    [definition_hash, JSON.stringify(definition_pure)],
                ]);
            }
        });
    }
    if (!SQL.getQueries())
        return;
    (0, database_1.default)(SQL.getQueries(), SQL.getValues(), (err) => {
        if (err) {
            console.error(err);
        }
        else {
        }
    });
};
// export default SaveTranslator
exports.default = router;
