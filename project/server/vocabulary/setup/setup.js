/*
  To run:
  node build/ylhyra_server.js --import-vocabulary
*/
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'
require('App/functions/array-foreach-async')
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import stable_stringify from 'json-stable-stringify'

const google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&random=${Math.random()}`

let dependencyGraph = {}
let keys = {}

/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async () => {
  const { data } = await axios.get(google_docs_url)
  let cards = []

  // console.log(data.split('\n')[0].split('\t'))
  // return;

  /* Read the table header to get the names of columns */
  let column_indexes_to_name = {}
  data.split('\n')[0].split('\t').forEach((name, index) => {
    if (!name.trim()) return;
    column_indexes_to_name[index] = name.trim()
  })

  data.split('\n').slice(1)
    // .slice(0, 100) // TEMP!!!
    .forEach(line => {

      /* Assing names to columns */
      let columns = {}
      line.split('\t').forEach((string, index) => {
        if (!column_indexes_to_name[index]) return;
        columns[column_indexes_to_name[index]] = string.trim() || null
      })

      // console.log(columns)
      // process.exit()

      const english = clean_string(columns.english)
      if (!columns.icelandic) return;
      if (!english) return;
      if (columns.should_be_taught == 'no') return;
      if (!columns.level) return;

      /* Can have multiple */
      let icelandic_strings = []
      columns.icelandic.split(/(.+?[^\\])([,;])/g).forEach(i => {
        i = i.trim()
        if (!i) return;
        if (i === ',' || i === ';') return;
        i = clean_string(i)
        icelandic_strings.push(i)
      })
      // const line_id = getHash(icelandic_strings)
      const ids_contained_in_this_entry = [
        ...icelandic_strings.map(getHash),
        ...getHashesFromCommaSeperated(columns.alternative_id),
      ]
      const depends_on = [
        ...getHashesFromCommaSeperated(columns.depends_on),
        ...getHashesFromCommaSeperated(columns.basic_form),
      ]
      if (depends_on.length > 0) {
        ids_contained_in_this_entry.forEach(id => {
          dependencyGraph[id] = depends_on
        })
      }

      let card_skeleton = {
        en: english,
        ids_contained_in_this_entry,
        depends_on,
        level: columns.level,
        word_ids: icelandic_strings.map(getHash),
      }

      if (columns.direction && columns.direction !== '<-' && columns.direction !== '->') {
        throw (`Unknown direction ${columns.direction}`)
      }

      /* Icelandic to English */
      if (columns.direction !== '<-') {
        icelandic_strings.forEach(i => {
          const id = getHash(i) + '_is';
          if (keys[id]) return console.log(`"${i}" already exists`)
          keys[id] = true
          cards.push({
            is: i,
            from: 'is',
            id,
            ...card_skeleton,
          })
          // s+=`${i}\t${english}\t${level}\n`
        })
      }

      /* English to Icelandic */
      if (columns.direction !== '->') {
        const id = getHash(columns.icelandic) + '_en'
        if (keys[id]) return console.log(`"${columns.icelandic}" already exists`)
        keys[id] = true
        cards.push({
          is: clean_string(columns.icelandic),
          from: 'en',
          id,
          ...card_skeleton,
        })
        // s+=`${english}\t${ clean_string(icelandic)}\t${level}\n`
      }
    })
  // console.log(dependencyGraph)
  console.log(`${cards.length} cards`)
  // console.log(cards.slice(0, 2))
  // return;
  await cards.forEachAsync(async ({
    is,
    en,
    id,
    from,
    level,
    word_ids,
  }) => {
    await new Promise((resolve) => {
      query(sql `INSERT INTO vocabulary_cards SET
        id = ${id},
        level = ${Math.floor(level) || null},
        data = ${stable_stringify({is,en,from,word_ids})}
        `, (err) => {
        if (err) {
          console.error(err)
          process.exit()
        } else {
          resolve()
        }
      })
    })
  })
  console.log('Done')
  process.exit()
}

const clean_string = (i) => {
  if (!i) return null;
  return i
    .replace(/\*/g, '')
    .replace(/\\,/g, ',')
    .replace(/'{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}



const getHash = (i) => {
  if (Array.isArray(i)) {
    return getHash(i.map(clean_string).join(';'))
  }
  const string = clean_string(i)
    .replace(/[.!]+$/, '')
    .toLowerCase()
  if (!string) return null;
  // return (string)
  return _hash(string)
}

const getHashesFromCommaSeperated = (i) => {
  if (!i) return [];
  return i.split(',').map(getHash).filter(Boolean)
}

// const get

// const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()

query(sql `
  TRUNCATE TABLE vocabulary_cards;
  TRUNCATE TABLE vocabulary_card_relations;
`, (err) => {
  if (err) {
    console.error(err)
  } else {
    run()
  }
})
