import forEachAsync from "modules/forEachAsync";
import string_hash from "modules/hash";
import { escape } from "sqlstring";
import flattenArray from "ylhyra/app/app/functions/flattenArray";
import query from "ylhyra/server/database";
import sql from "ylhyra/server/database/functions/SQL-template-literal";
import simplifyString from "ylhyra/content/translator/translator.server/suggestions/helpers/simplifyString";
import GetTranslationFrame from "ylhyra/content/translator/translator.server/suggestions/helpers/translationFrame";

/**
 * Suggestions based on our previous translations
 *
 * Todo:
 * - Streamline
 * - Take analysis into consideration
 * - MySQL requests can easily become very large (Error: "max_allowed_packet").
 */

const request = ({ list }) => {
  return new Promise(async (resolve) => {
    let queries = [];

    for (let sentence_id of Object.keys(list.sentences)) {
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

        const textHash = string_hash(simplifyString(word.text));
        const translationFrame = GetTranslationFrame(sentence.words, index);
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
                    translationFrame.length > 0 &&
                    `
                    AND (
                      ${translationFrame
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
                    translationFrame.length > 0 &&
                    `
                    AND (
                      ${translationFrame
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
              WHERE text_hash = ${escape(textHash)}
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
    let returns = [];
    await forEachAsync(queries, async (q) => {
      await new Promise<void>((resolve2, reject2) => {
        query(q, (err, results) => {
          if (err) {
            console.error("Error in GetSuggestions.js:");
            console.error(err);
            reject2();
          } else {
            results = flattenArray(results);
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
