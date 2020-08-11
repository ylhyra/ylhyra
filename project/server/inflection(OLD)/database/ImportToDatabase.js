/*
  To run:
  node build/ylhyra_server.js --import-inflections
*/
var LineByLineReader = require('line-by-line')
// var inflections = require('./inflections.js')
import query from 'server/database'
const string_hash = require('string-hash');
let count = 0
import path from 'path'
import sql from 'server/database/functions/SQL-template-literal'

const CSV_FILE_NAME = 'KRISTINsnid.csv'
const CSV_FILE_LINES = 6334181 // Number of lines

query(`TRUNCATE TABLE inflection;`, (err, res) => {
  var lr = new LineByLineReader(path.resolve(__dirname, `./${CSV_FILE_NAME}`))
  lr.on('error', (err) => {
    console.error(err)
  });

  lr.on('line', (line) => {
    lr.pause()
    if (line.trim() == '') {
      lr.resume()
    } else {
      /*
        See https://bin.arnastofnun.is/DMII/LTdata/k-format/
      */
      let [
        base_word, // 1
        BIN_id, // 2
        word_class, // 3
        BIN_domain, // 4
        correctness_grade_of_base_word, // 5
        register_of_base_word, // 6
        grammar_group, // 7
        cross_reference, // 8
        descriptive, // 9 - K = Core, V = other
        inflectional_form, // 10
        grammatical_tag, // 11
        correctness_grade_of_word_form, // 12
        register_of_word_form, // 13
        only_found_in_idioms, // 14
        alternative_entry, // 15
      ] = line.split(';')

      // if(BIN_id != 433568) {
      //   return  lr.resume()
      // }

      /* Only the words marked with "K" (meaning "Core") are descriptive and should be taught */
      descriptive = (descriptive === 'K') ? true : false

      query(sql `
        SET sql_mode="TRADITIONAL";
        INSERT INTO inflection SET
          base_word = ${base_word},
          base_word_lowercase = ${base_word.toLowerCase()},
          BIN_id = ${BIN_id},
          word_class = ${word_class},
          correctness_grade_of_base_word = ${correctness_grade_of_base_word || null},
          register_of_base_word = ${register_of_base_word},
          grammar_group = ${grammar_group},
          cross_reference = ${cross_reference || null},
          descriptive = ${descriptive},
          inflectional_form = ${inflectional_form},
          inflectional_form_lowercase = ${inflectional_form.toLowerCase()},
          grammatical_tag = ${grammatical_tag},
          correctness_grade_of_word_form = ${correctness_grade_of_word_form || null},
          register_of_word_form = ${register_of_word_form},
          only_found_in_idioms = ${only_found_in_idioms},
          alternative_entry = ${alternative_entry}
      `, (error, results, fields) => {
        if (error) {
          console.error(error)
        }
        lr.resume()
      })

      count++
      if (count % 1000 === 1) {
        process.stdout.write(`\x1Bc\r${(count / CSV_FILE_LINES * 100).toFixed(1)}% ${base_word}`)
      }


      // inflections(line, (entry) => {
      //
      //   // console.log(JSON.stringify(entry.entry.content, null, 2).slice(0,1000))
      //   // process.exit()
      //
      //   if (count % 1000 === 0) {
      //     console.log(`${(count / 278704 * 100).toFixed(1)}% ${entry.base}`)
      //   }
      //   count++
      //
      //   if (entry.base !== null) {
      //     const hash = string_hash(line).toString(36)
      //
      //     let beygjanleg_query = ''
      //     let beyginleg_input = []
      //     for (let i of entry.forms) {
      //       beygjanleg_query += `INSERT INTO words_to_inflection SET lowercase = ?, word = ?, classification = ?, inflection_hash = ?;`
      //       beyginleg_input.push(i.value.toLowerCase(), i.value, i.flokkun, hash)
      //     }
      //
      //     query(beygjanleg_query +
      //       `INSERT INTO inflection SET hash = ?, base = ?, entry = ?;`, [...beyginleg_input, hash, entry.base, JSON.stringify(entry.entry)],
      //       (error, results, fields) => {
      //         if (error) {
      //           console.error(error)
      //         }
      //         lr.resume()
      //       });
      //   } else {
      //     lr.resume()
      //   }
      // })
    }
  });

  lr.on('end', () => {
    process.exit()
  });
})
