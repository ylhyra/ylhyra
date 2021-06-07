/*

  Generates an index for fuzzy search

  Setup:
  Fetch KRISTINsnid.csv from BÍN.
  Then generate a simple list of unique lowercase words with:
  > awk -F ';' '{print $10}' KRISTINsnid.csv | tr '[:upper:]' '[:lower:]' | sort -u > ordalisti.csv
  Then run:
  > node build/ylhyra_server.js --generate-search-index



  Scoring:

  * 5 - original word
  * 4 - original word is capitalized
  * 3 - without special characters
  * 2 - major spelling errors
  * 1 - phonetic

*/
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import { escape } from 'sqlstring'

import {
  cleanInput,
  phonetic,
  without_special_characters,
  with_spelling_errors,
  removeTemporaryMarkers,
  WITHOUT_SPECIAL_CHARACTERS_MARKER,
  WITH_SPELLING_ERROR_MARKER,
  PHONETIC_MARKER,
} from './../fuzzy_search'
import path from 'path'
import _ from 'underscore'
import flattenArray from 'project/frontend/App/functions/flattenArray'
var LineByLineReader = require('line-by-line')

const CSV_FILE_NAME = 'ordalisti.csv'
const CSV_FILE_LINES = 3071707 // Number of lines, calculated with "wc -l"
let count = 0
// import { compareTwoStrings } from 'string-similarity'

var lr = new LineByLineReader(path.resolve(__dirname, `./${CSV_FILE_NAME}`))
lr.on('error', (err) => {
  console.error(err)
});

lr.on('line', (line) => {
  lr.pause()
  if (line.trim() == '') {
    lr.resume()
  } else {
    const word = line
    let inputs
    inputs = [{
      text: cleanInput(word),
      score: word === cleanInput(word) ? 5 : 4,
    }]
    inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
    // inputs = inputs.filter(input => input.score >= 3)

    const values = flattenArray(inputs.map(input => ([input.text, word, input.score])))
    query(
      `DELETE FROM autocomplete WHERE output = ${escape(word)};` +
      `INSERT INTO autocomplete SET input = ?, output = ?, score = ?;`.repeat(inputs.length), values, (err, results) => {
      if (err) {
        console.error(err)
        throw (err)
      } else {

        count++
        if (count % 100 === 1) {
          process.stdout.write(`\x1Bc\r${(count / CSV_FILE_LINES * 100).toFixed(1)}% ${word}`)
        }

        lr.resume()
      }
    })
  }
});

lr.on('end', () => {
  process.exit()
});

const clean = (words) => words.map(word => ({
  text: cleanInput(word.text),
  score: word.score,
}))

const addPhoneticAndSpellingErrors = (inputs) => {
  let additions = []

  inputs.forEach(({ text, score }) => {
    additions.push({
      text: without_special_characters(text),
      score: 3
    })
    additions.push({
      text: with_spelling_errors(text),
      score: 2
    })
    additions.push({
      text: phonetic(text),
      score: 1
    })
  })

  return [
    ...inputs,
    ...additions,
  ]
}

const UniqueByMaxScore = (inputs) => {
  const sorted = inputs.sort((a, b) => b.score - a.score)
  /* Store array of texts so that we can filter out already-seen ones in the next step */
  const texts = sorted.map(word => removeTemporaryMarkers(word.text))
  return sorted
    .filter((word, index) => index === texts.indexOf(removeTemporaryMarkers(word.text)))
    .map(word => ({
      text: word.text,
      score: Math.round(word.score),
    }))
}

// const demo = async () => {
//   const word = 'Þórsmörk'
//   let inputs = [{
//     text: cleanInput(word),
//     score: word === cleanInput(word) ? 100 : 90,
//   }]
//   inputs = UniqueByMaxScore(autocomplete(inputs))
//   inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
//   inputs = inputs.filter(input => input.score >= 3)
//
//   console.log(inputs)
//   process.exit()
// }
// demo()
