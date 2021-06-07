/*
  Fuzzy search. Finds items with typos and auto-completes.

  Note: This file currently relies on being a submodule of Ylhýra.
*/
import express from 'express'
const router = express.Router()
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
require('array-sugar')
import { colognePhonetic } from 'cologne-phonetic'
import { remove as remove_diacritics } from 'diacritics'
import Word from './../../tables/word'
import phoneticHash from './phoneticHash'
import { removeLinks } from './../../tables/link'
export const WITHOUT_SPECIAL_CHARACTERS_MARKER = '@'
export const WITH_SPELLING_ERROR_MARKER = '^'
export const PHONETIC_MARKER = '~'
import classify from 'server/inflection/tables/classification/BIN_classification'
import { sort_by_classification } from 'server/inflection/tables/classification/sort_by_classification'

export default ({ word, return_rows_if_only_one_match }, callback) => {
  query(sql `
    SELECT
        score,
        i2.BIN_id,
        i2.BIN_domain,
        i2.grammatical_tag,
        i2.inflectional_form,
        i2.word_categories,
        i2.base_word,
        i2.correctness_grade_of_word,
        i2.word_register,
        i2.grammar_group,
        i2.cross_reference,
        i2.should_be_taught,
        i2.grammatical_tag,
        i2.correctness_grade_of_inflectional_form,
        i2.register_of_inflectional_form,
        i2.various_feature_markers,
        i2.alternative_entry,
        inner_table.inflectional_form as matched_term,
        (output = i2.inflectional_form_lowercase) as variant_matched,
        (CASE WHEN inner_table.score >= 4 THEN 1 ELSE 0 END) as word_has_perfect_match,
        (output = i2.base_word) as base_word_matched
      FROM
      (
       SELECT score, i1.inflectional_form, i1.BIN_id, output FROM (
         SELECT score, output FROM autocomplete
           WHERE input = ${word}
           OR input = ${without_special_characters(word)}
           OR input = ${with_spelling_errors(word)}
           -- OR input = ${phonetic(word)}
           ORDER BY
           autocomplete.score DESC
           LIMIT 20 -- Necessary?
       ) a
       LEFT JOIN inflection i1
         ON a.output = i1.inflectional_form_lowercase
         GROUP BY BIN_id
       ORDER BY
         a.score DESC,
         i1.should_be_taught DESC,
         i1.correctness_grade_of_inflectional_form ASC,
         i1.correctness_grade_of_word ASC,
         i1.inflectional_form ASC
         -- ,
         -- i1.BIN_id ASC
       ) as inner_table
     LEFT JOIN inflection i2
       ON inner_table.BIN_id = i2.BIN_id
       ORDER BY
         base_word_matched DESC
  `, (err, rows) => {
    if (err) {
      console.error(err)
      callback(null)
    } else if (rows.length === 0) {
      callback(null)
    } else {
      // console.log(rows.map(row => row.base_word).join(', '))
      // console.log(rows.slice(0,2))
      try {
        let words = []
        let BIN_ids = []
        rows.forEach(row => {
          let index = BIN_ids.findIndex(i => i === row.BIN_id)
          if (index < 0) {
            BIN_ids.push(row.BIN_id)
            words.push([])
            index = words.length - 1
          }
          words[index].push(classify(row))
        })

        let output = []
        words.forEach(rows1 => {
          const word = new Word(rows1.sort(sort_by_classification))
          /* Prevent "null" from appearing during index creation, which causes Word() to fail */
          if (word.getId()) {
            output.push({
              perfect_match: rows1[0].word_has_perfect_match,
              BIN_id: word.getId(),
              base_word: word.getBaseWord(),
              description: removeLinks(word.getWordDescription()),
              snippet: removeLinks(word.getSnippet()),
              matched_term: rows1[0].matched_term,
              rows: rows1,
            })
          }
        })

        let perfect_matches = []
        let did_you_mean = []

        output.forEach(item => {
          if (item.perfect_match) {
            perfect_matches.push(item)
          } else {
            did_you_mean.push(item)
          }
        })

        let returns = {
          perfect_matches,
          did_you_mean,
        }

        // /*
        //   Only one match, return rows so that a table may be printed immediately
        // */
        // if (perfect_matches.length === 1 && return_rows_if_only_one_match) {
        //   returns.rows = perfect_matches[0].rows
        // }

        callback(returns)
      } catch (e) {
        console.error(e)
        callback('Error')
      }
    }
  })
}

export const cleanInput = (input) => {
  return input && input.toLowerCase().replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')
}

export const without_special_characters = (string) => {
  string = WITHOUT_SPECIAL_CHARACTERS_MARKER + string
    .replace(/þ/g, 'th')
    .replace(/ð/g, 'd')
    .replace(/ö/g, 'o')
  return remove_diacritics(string)
}

export const with_spelling_errors = (string) => {
  return WITH_SPELLING_ERROR_MARKER + removeTemporaryMarkers(without_special_characters(string))
    .replace(/y/g, 'i')
    .replace(/([^\w\s])|(.)(?=\2)/g, '') // Remove two in a row
}

export const phonetic = (string) => {
  return PHONETIC_MARKER + phoneticHash(removeTemporaryMarkers(without_special_characters(string)))
}

export const removeTemporaryMarkers = (input) => {
  return input
    .replace(WITHOUT_SPECIAL_CHARACTERS_MARKER, '')
    .replace(WITH_SPELLING_ERROR_MARKER, '')
    .replace(PHONETIC_MARKER, '')
}
