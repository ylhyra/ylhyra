/*
  To run:
  node build/ylhyra_server.js --import-vocabulary
*/
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'
const path = require('path')
const fs = require('fs')
require('App/functions/array-foreach-async')
import query from 'server/database'
import sql from 'server/database/functions/SQL-template-literal'
import stable_stringify from 'json-stable-stringify'

let google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&random=${Math.random()}`

const TESTING = true
if (TESTING) {
  /* Spænska */
  google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT_pzDyG0wMUZbPK9yf_i4AYrKjbKs6nFmexJMK5s6IsdIRQk96uP77GDqyiR-FvSCgjBaUFMh3DlYw/pub?output=tsv&random=${Math.random()}`
}


/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async() => {

  let terms = {}
  let cards = {}
  let dependencies = {}
  let alternative_ids = {}

  const TermsToCardId = (_terms, id) => {
    _terms.forEach(term => {
      if (!terms[term]) {
        terms[term] = {
          level: null,
          cards: []
        }
      }
      terms[term].cards.push(id)
    })
  }
  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = dependencies
    if (type === 'alt_ids') {
      obj = alternative_ids
    }
    first.forEach(id => {
      obj[id] = [
        ...(obj[id] || []),
        ...second,
      ]
    })
  }

  const { data } = await axios.get(google_docs_url)
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
    .forEach((line, line_number) => {
      let to_add = []

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
      if (!columns.level && !TESTING) return;

      /* Can have multiple */
      let icelandic_strings = []
      columns.icelandic.split(/(.+?[^\\])([,;])/g).forEach(i => {
        i = i.trim()
        if (!i) return;
        if (i === ',' || i === ';') return;
        i = clean_string(i)
        icelandic_strings.push(i)
      })
      const terms_in_this_line = icelandic_strings.map(getHash)
      const alternative_ids = getHashesFromCommaSeperated(columns.alternative_id)
      const depends_on = [
        ...getHashesFromCommaSeperated(columns.depends_on),
        ...getHashesFromCommaSeperated(columns.basic_form),
      ]

      AddToDependencyGraph(terms_in_this_line, depends_on)
      AddToDependencyGraph(alternative_ids, terms_in_this_line, 'alt_ids')

      let card_skeleton = {
        en: english,
        terms: terms_in_this_line,
        level: columns.level,
        sort: line_number,
      }

      if (columns.direction && columns.direction !== '<-' && columns.direction !== '->') {
        throw (`Unknown direction ${columns.direction}`)
      }

      /* Icelandic to English */
      if (columns.direction !== '<-') {
        icelandic_strings.forEach(i => {
          to_add.push({
            is: i,
            from: 'is',
            id: getHash(i) + '_is',
            ...card_skeleton,
          })
        })
      }

      /* English to Icelandic */
      if (columns.direction !== '->') {
        to_add.push({
          is: clean_string(columns.icelandic),
          from: 'en',
          id: getHash(columns.icelandic) + '_en',
          ...card_skeleton,
        })
      }

      to_add.forEach(({ id, ...card }) => {
        if (cards[id]) return console.log(`"${columns.icelandic}" already exists`)
        // [...terms_in_this_line, ...alternative_ids].forEach(j => {
        //   termsToCardIds[j] = [
        //     ...(termsToCardIds[j] || []),
        //     card.id
        //   ]
        // })
        // termDependsOnTerms[card.id] = terms_in_this_line
        TermsToCardId(terms_in_this_line, id)
        cards[id] = card
      })
    })

  // /* Process dependency graph */
  // let dependencyGraphProcessed = {}
  // for (let from_term in cardIdsSeen) {
  //   if (typeof (cardIdsSeen[from_term]) == "function") continue;
  //   dependencyGraphProcessed[from_term] = CreateDependencyChain(from_term)
  // }

  // cards = cards.sort((a, b) => {
  //   if (a.level !== b.level) {
  //     return a.level - b.level
  //   }
  //   // if(dependencyGraphProcessed[a.])
  //   return a.sort - b.sort
  // }).map((card, index) => ({
  //   ...card,
  //   sort: index,
  // }))

  console.log(`${Object.keys(cards).length} cards`)
  // await cards.forEachAsync(async({
  //   is,
  //   en,
  //   id,
  //   from,
  //   level,
  //   word_ids,
  //   sort,
  //   terms,
  // }) => {
  //   await new Promise((resolve) => {
  //     query(sql `INSERT INTO vocabulary_cards SET
  //       id = ${id},
  //       level = ${Math.floor(level) || null},
  //       sort = ${sort},
  //       data = ${stable_stringify({
  //         is,
  //         en,
  //         from,
  //         word_ids,
  //       })}
  //       ;
  //       `, (err) => {
  //       if (err) {
  //         console.error(err)
  //         process.exit()
  //       } else {
  //         resolve()
  //       }
  //     })
  //     // let queries = []
  //     // terms.forEach(term => {
  //     //   queries.push(sql `INSERT INTO vocabulary_card_relations SET
  //     //     from_id = ${id},
  //     //     to_id = ${term},
  //     //     relation_type = "belongs_to"
  //     //     ;
  //     //   `)
  //     // })
  //     // if (dependencyGraphProcessed[id]) {
  //     //   for (let to_term in dependencyGraphProcessed[id]) {
  //     //     if (typeof (dependencyGraphProcessed[id][to_term]) == "function") continue;
  //     //     queries.push(sql `INSERT INTO vocabulary_card_relations SET
  //     //       from_id = ${id},
  //     //       to_id = ${to_term},
  //     //       relation_depth = ${dependencyGraphProcessed[id][to_term]},
  //     //       relation_type = "depends_on"
  //     //       ;
  //     //     `)
  //     //   }
  //     // }
  //     // query(queries.join(''), (err) => {
  //     //   if (err) {
  //     //     console.error(err)
  //     //     process.exit()
  //     //   }
  //     // })
  //   })
  // })
  // fs.writeFileSync(path.resolve(__dirname, `terms.json`), JSON.stringify(termDependsOnTerms, null, 2), function () {})
  fs.writeFileSync(path.resolve(__dirname, `./../vocabulary_database.json`), JSON.stringify({
    cards,
    terms,
    dependencies,
    alternative_ids,
  }, null, 2), function () {})
  console.log('Done 1')
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

// const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()

/**
 * Returns an object on the form { [key]: [depth] }
 */
const CreateDependencyChain = (from_term, _alreadySeen = [], output = [], depth = 0) => {
  // termDependsOnTerms[from_term].forEach(term => {
  //   const alreadySeen = [..._alreadySeen] /* Deep copy in order to only watch direct parents */
  //   if (alreadySeen.includes(term)) return;
  //   alreadySeen.push(term)
  //   const card_ids = termsToCardIds[term] || []
  //   if (card_ids.some(id => alreadySeen.includes(id))) return;
  //   card_ids.forEach(card_id => {
  //     if (depth > 0) {
  //       output[card_id] = Math.max(output[card_id] || 0, depth)
  //     }
  //     alreadySeen.push(card_id)
  //   })
  //   if (termDependsOnTerms[term]) {
  //     CreateDependencyChain(term, alreadySeen, output, card_ids.length > 1 ? depth + 1 : depth)
  //   }
  // })
  // if (depth === 0) {
  //   return output
  // }
}


// query(sql `
//   TRUNCATE TABLE vocabulary_cards;
//   TRUNCATE TABLE vocabulary_card_relations;
// `, (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     run()
//   }
// })
run()
