import query from 'common/database/tagger'
import string_hash from 'App/functions/hash'
require('App/functions/sortByArray')

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
const SaveTranslator = ({ document_id, from, to, translation, list, }) => {
  if (!list) return;
  const { sentences, words, arrayOfAllWordIDs } = list

  const SQL = new SQL_helper()


  /*
    Remove previously saved translations for this document
    (Temporary: Does not remove joins as
     they may be shared with others)
  */
  SQL.query([`
    DELETE w -- a,b,c,d
      FROM words_and_sentences as w
      WHERE w.document_id = ?;`, [
    document_id,
  ]])

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

  for (let sentence_id in list.sentences) {
    const sentence = list.sentences[sentence_id]

    // TODO: Save sentence definition
    // const definition = translation.sentences[sentence_id]


    /*
      Save sentence
    */
    if (translation.sentences[sentence.id]) {
      const definition = translation.sentences[sentence.id]
      const { contains, ...definition_pure } = definition
      const text_hash = string_hash(simplifyString(sentence.text))
      const definition_hash = string_hash(definition_pure)

      SQL.query([`
        INSERT INTO words_and_sentences SET
          from_lang = ?,
          to_lang = ?,
          text_hash = ?,
          definition_hash = ?,
          document_id = ?;`, [
        from, to, text_hash, definition_hash, document_id,
      ]])

      SQL.query([`
        INSERT IGNORE INTO definitions SET
          definition_hash = ?,
          definition = ?;
          `, [
        definition_hash, JSON.stringify(definition_pure)
      ]])
    }


    /*
      Save words
    */
    sentence.words.forEach((word, index) => {
      if (typeof word === 'string' || !word.id) return;
      if (translation.words[word.id]) {
        const definition = translation.definitions[translation.words[word.id]]
        if (!definition.contains) return;

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
        const { contains, ...definition_pure } = definition // TODO copy to next file...

        const text_hash = string_hash(simplifyString(word.text))
        const definition_hash = string_hash(definition_pure)

        const translation_frame = GetTranslationFrame(sentence.words, index, contains)
        const translation_frame_hash = string_hash(translation_frame)

        SQL.query([`
          INSERT INTO words_and_sentences SET
            from_lang = ?,
            to_lang = ?,
            text_hash = ?,
            translation_frame_hash = ?,
            document_id = ?;`, [
          from, to, text_hash, translation_frame_hash, document_id,
        ]])

        SQL.query([`
          INSERT IGNORE INTO translation_frames SET
            translation_frame_hash = ?,
            definition_hash = ?;`, [
          translation_frame_hash, definition_hash
        ]])

        // TEMP (Ég ætti líklega að finna betri leið til að stimpla allt þetta inn...)
        SQL.query([`
          DELETE w FROM words_in_translation_frame as w
          WHERE w.translation_frame_hash = ?;`, [
          translation_frame_hash,
        ]])

        translation_frame.forEach(word_in_frame => {
          SQL.query([`
            INSERT IGNORE INTO words_in_translation_frame SET
              translation_frame_hash = ?,
              position_relative_to_center_word = ?,
              word = ?,
              is_part_of_definition = ?;`, [
            translation_frame_hash,
            word_in_frame.position_relative_to_center_word,
            word_in_frame.text,
            word_in_frame.is_part_of_definition,
          ]])
        })

        SQL.query([`
          INSERT IGNORE INTO definitions SET
            definition_hash = ?,
            definition = ?;
            `, [
          definition_hash, JSON.stringify(definition_pure)
        ]])

      }
    })
  }

  if (!SQL.getQueries()) return;

  query(SQL.getQueries(), SQL.getValues(), (err, results) => {
    if (err) {
      console.error(err)
    } else {}
  })
}

export default SaveTranslator



export class SQL_helper {
  constructor() {
    this.queries = ''
    this.values = []
  }
  query(input) {
    /*
      Some of our queries can be too large for MySQL to handle. (Error: "max_allowed_packet")
      We put a limit to the length of queries and thus force the frontend
      to only request a limited amount of suggestions at a time.
    */
    if(this.queries.length + input[0] > 3000) {
      return
    }

    this.queries += input[0]
    this.values = this.values.concat(input[1])
  }
  getQueries() {
    return this.queries
  }
  getValues() {
    return this.values
  }
}




export const simplifyString = (input) => {
  return input
    .toLowerCase()
    .replace(/[.,'-/"\\!]/g, '')
    .replace(/\s+/, ' ')
    .trim()
}



export const GetTranslationFrame = (words, index, contains) => {
  let translation_frame = {}
  let spaces = 0

  /*
    -3, -2, -1,
  */
  for (let i = -1; i + spaces >= -3; i--) {
    const word = words[index + i]
    if (word === ' ') {
      spaces++
      continue;
    } else if (typeof word === 'string' || !word) {
      break;
    }
    translation_frame[i + spaces] = word
  }

  /*
    0, +1, +2, +3,
  */
  spaces = 0
  for (let i = 0; i - spaces <= 3; i++) {
    const word = words[index + i]
    if (word === ' ') {
      spaces++
      continue;
    } else if (typeof word === 'string' || !word) {
      break;
    }
    translation_frame[i - spaces] = word
  }

  return Object.keys(translation_frame).sort((a, b) => parseInt(a) - parseInt(b)).map(key => {
    const word = translation_frame[key]
    return {
      ...word,
      text: simplifyString(word.text),
      position_relative_to_center_word: parseInt(key),
      is_part_of_definition: contains && contains.includes(word.id)
    }
  })
}
