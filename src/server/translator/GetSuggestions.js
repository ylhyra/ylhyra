import query from "server/database";
import string_hash from "src/app/App/functions/hash";
import flattenArray from "src/app/App/functions/flattenArray";
import simplifyString from "./helpers/simplifyString";
import GetTranslationFrame from "./helpers/TranslationFrame";
import sql from "server/database/functions/SQL-template-literal";
import { escape } from "sqlstring";


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
  return new Promise(async (resolve, reject) => {
    let queries = [];

    for (let sentence_id in list.sentences) {
      const sentence = list.sentences[sentence_id];

      /*
        Search sentences
      */
      if (typeof sentence !== "string" && sentence.id) {
        const text_hash = string_hash(simplifyString(sentence.text));
        queries.push(sql`
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
        if (typeof word === "string" || !word.id) return;

        const text_hash = string_hash(simplifyString(word.text));
        const translation_frame = GetTranslationFrame(sentence.words, index);
        // console.log(translation_frame)
        queries.push(`
          SELECT ${escape(
            word.id
          )} as item_id, definition, definition_hash, also_part_of_definition FROM (
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
                  ${
                    translation_frame.length > 0 &&
                    `
                    AND (
                      ${translation_frame
                        .map(
                          (frame) => `
                        (
                          word = ${escape(frame.text)}
                          AND position_relative_to_center_word = ${escape(
                            frame.position_relative_to_center_word
                          )}
                        )
                      `
                        )
                        .join(" OR ")}
                    )`
                  }
              ) as HAS_CORRECT_AMOUNT_OF_MATCHES,

              # SCORE
              (
                SELECT SUM(10 - ABS(position_relative_to_center_word))
                  FROM words_in_translation_frame
                  WHERE translation_frame_hash = t.translation_frame_hash
                  ${
                    translation_frame.length > 0 &&
                    `
                    AND (
                      ${translation_frame
                        .map(
                          (frame) => `
                        (
                          word = ${escape(frame.text)}
                          AND position_relative_to_center_word = ${escape(
                            frame.position_relative_to_center_word
                          )}
                        )
                      `
                        )
                        .join(" OR ")}
                    )`
                  }
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
              WHERE text_hash = ${escape(text_hash)}
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
    await queries.forEachAsync(async (q) => {
      await new Promise((resolve2, reject2) => {
        query(q, (err, results) => {
          if (err) {
            console.error("Error in GetSuggestions.js:");
            console.error(err);
            reject2();
          } else {
            results = flattenArray(results);
            // console.log(JSON.stringify(results, null, 2))
            returns.push(results);
            resolve2();
          }
        });
      });
    });
    returns = flattenArray(returns);
    resolve(returns);
  });
};

export default request;
