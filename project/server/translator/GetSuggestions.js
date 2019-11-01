import query from 'server/database'
import string_hash from 'App/functions/hash'
import flattenArray from 'project/text-plugin/App/functions/flattenArray'
import { GetTranslationFrame, simplifyString, SQL_helper } from './SaveTranslations'

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

const request = ({ list, from, to }, callback) => {
  if (!list || !to || !from) return;
  const { sentences, words, arrayOfAllWordIDs } = list

  const SQL = new SQL_helper()

  for (let sentence_id in list.sentences) {

    const sentence = list.sentences[sentence_id]


    /*
      Search sentences
    */
    if (typeof sentence !== 'string' && sentence.id) {
      const text_hash = string_hash(simplifyString(sentence.text))
      SQL.query([`
        SELECT ? as item_id, definition, definition_hash FROM (
          SELECT
            definitions.definition_hash,
            definitions.definition
            FROM words_and_sentences
            JOIN definitions
              ON words_and_sentences.definition_hash = definitions.definition_hash
            WHERE text_hash = ?
              AND from_lang = ?
              AND to_lang = ?
          ) as inner_table
        GROUP BY definition_hash
        LIMIT 15;
      `, [
        sentence.id, text_hash, from, to
      ]])
    }

    /*
      Search words
    */
    sentence.words.slice(0, 30).forEach((word, index) => { // TODO ?? Af hverju geri ég "slice"???
      if (typeof word === 'string' || !word.id) return;

      /*
        TODO
        Check if suggestion has already been made
      */

      const text_hash = string_hash(simplifyString(word.text))
      const translation_frame = GetTranslationFrame(sentence.words, index)

      SQL.query([`
        SELECT ? as item_id, definition, definition_hash, also_part_of_definition FROM (
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
                ${translation_frame.length > 0 && `
                  AND (
                    ${translation_frame.map(frame => `
                      (
              					word = "${frame.text}"
              					AND position_relative_to_center_word = ${frame.position_relative_to_center_word}
              				)
                    `).join(' OR ')}
                  )`
                }
          	) as HAS_CORRECT_AMOUNT_OF_MATCHES,

          	# SCORE
          	(
          		SELECT SUM(10 - ABS(position_relative_to_center_word))
          			FROM words_in_translation_frame
          			WHERE translation_frame_hash = t.translation_frame_hash
                ${translation_frame.length > 0 && `
                  AND (
                    ${translation_frame.map(frame => `
                      (
                        word = "${frame.text}"
                        AND position_relative_to_center_word = ${frame.position_relative_to_center_word}
                      )
                    `).join(' OR ')}
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
          	WHERE text_hash = ?
              AND from_lang = ?
              AND to_lang = ?
          	HAVING HAS_CORRECT_AMOUNT_OF_MATCHES = TRUE
          	ORDER BY SCORE
          ) as inner_table
        GROUP BY definition_hash
        LIMIT 15;
      `, [
        word.id, text_hash, from, to
      ]])
    })
  }

  // console.log(SQL.getQueries())
  if (!SQL.getQueries()) return;

  // SQL.getQueries().forEach(()=>{
  //
  // })

  query(SQL.getQueries(), SQL.getValues(), (err, results) => {
    if (err) {
      console.error(err)
    } else {
      results = flattenArray(results)
      // console.log(JSON.stringify(results, null, 2))
      callback({
        type: 'REQUEST_SUGGESTIONS',
        content: results,
      })
    }
  })
}

export default request
