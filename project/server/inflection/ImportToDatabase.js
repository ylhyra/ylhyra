/*
  To run:
  > node build/ylhyra_server.js --import-inflections
*/
var LineByLineReader = require('line-by-line')
// var inflections = require('./inflections.js')
import query from 'server/database'
const string_hash = require('string-hash');
let count = 0

console.log('haha')

query(`TRUNCATE TABLE inflection; TRUNCATE TABLE words_to_inflection;`, (err, res) => {
  var lr = new LineByLineReader('./KRISTINsnid.csv')
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
      const [
        base_word, // 1
        BIN_id, // 2
        word_class, // 3
        BIN_domain, // 4
        correctness_grade_of_base_word, // 5
        register_of_base_word, // 6
        grammar_group, // 7
        cross_reference, // 8
        visibility, // 9 - K = Core, V = other
        inflectional_form, // 10
        grammatical_tag, // 11
        correctness_grade_of_word_form, // 12
        register_of_word_form, // 13
        only_found_in_idioms, // 14
        alternative_entry, // 15
      ] = line.split(';')

      console.log(base_word)
      process.exit()

    }
  });

  lr.on('end', () => {
    process.exit()
  });
})
