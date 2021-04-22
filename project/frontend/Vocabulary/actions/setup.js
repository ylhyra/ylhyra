import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import { loadDeck } from './deck'
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'

const file_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&sdf=1`

let dependencyGraph = {}

/*
  Convert vocabulary data into a JavaScrip object
*/
export default async(title) => {
  const { data } = await axios.get(file_url)
  let cards = []
  let s = ''
  data.split('\n').slice(1)
    .slice(0, 100) // TEMP!!!
    .forEach(line => {
      let [
        icelandic,
        english,
        _depends_on,
        level,
        not_to_be_confused_with,
        basic_form,
        direction,
        note_before_show,
        note_after_show,
        literally,
        should_be_taught,
        categories,
        grammar_items,
        importance,
        alternative_id,
      ] = line.split('\t')

      english = clean_string(english)
      if (!icelandic) return;
      if (!english) return;
      if (should_be_taught == 'no') return;

      /* Can have multiple */
      let icelandic_strings = []
      icelandic.split(/(.+?[^\\])([,;])/g).forEach(i => {
        i = i.trim()
        if (!i) return;
        if (i === ',' || i === ';') return;
        i = clean_string(i)
        icelandic_strings.push(i)
      })
      // const line_id = getHash(icelandic_strings)
      const ids_contained_in_this_entry = [
        ...icelandic_strings.map(getHash),
        ...getHashesFromCommaSeperated(alternative_id),
      ]
      const depends_on = [
        ...getHashesFromCommaSeperated(_depends_on),
        ...getHashesFromCommaSeperated(basic_form),
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
        level,
      }

      /* Icelandic to English */
      if (direction !== '<-') {
        icelandic_strings.forEach(i => {
          cards.push({
            is: i,
            from: 'is',
            id: getHash(i) + '_is',
            ...card_skeleton,
          })
          // s+=`${i}\t${english}\t${level}\n`
        })
      }

      /* English to Icelandic */
      if (direction !== '->') {
        cards.push({
          is: clean_string(icelandic),
          from: 'en',
          id: getHash(icelandic) + '_en',
          ...card_skeleton,
        })
        // s+=`${english}\t${ clean_string(icelandic)}\t${level}\n`
      }
    })
  console.log(dependencyGraph)
  return cards
}

const clean_string = (i) => i
  .replace(/\*/g, '')
  .replace(/\\,/g, ',')
  .replace(/'{2,}/g, '')
  .replace(/\s+/g, ' ')
  .trim()

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
  return i.split(',').map(getHash).filter(Boolean)
}

// const get

// const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()
