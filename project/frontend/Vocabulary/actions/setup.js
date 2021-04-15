import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import { loadDeck } from './deck'
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'

const file_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&sdf=1`

/*
  Convert vocabulary data into a JavaScrip object
*/
export default async (title) => {
  const { data } = await axios.get(file_url)
  let cards = []
  data.split('\n').slice(1)
    // .slice(0, 30)
    .forEach(line => {
      let [
        icelandic,
        english,
        depends_on,
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
      if (!english) return;

      /* Can have multiple */
      let icelandic_strings = []
      icelandic.split(/(.+?[^\\])([,;])/g).forEach(i => {
        i = i.trim()
        if (!i) return;
        if (i === ',' || i === ';') return;
        i = clean_string(i)
        icelandic_strings.push(i)
      })

      let card_skeleton = {
        en: english,
        associated_ids: [
          ...icelandic_strings.map(getHash),
          ...getHashesFromCommaSeperated(alternative_id),
        ],
        depends_on: getHashesFromCommaSeperated(depends_on),
        level,
      }

      /* Icelandic to English */
      if (direction !== '<-') {
        icelandic_strings.forEach(i => {
          cards.push({
            is: i,
            from: 'is',
            id: [i, english].map(getHash) + '_is',
            ...card_skeleton,
          })
        })
      }

      /* English to Icelandic */
      if (direction !== '->') {
        cards.push({
          is: clean_string(icelandic),
          from: 'en',
          id: [icelandic, english].map(getHash) + '_en',
          ...card_skeleton,
        })
      }
    })

  return cards
}

const clean_string = (i) => i
  .replace(/\*/g, '')
  .replace(/\\,/g, ',')
  .replace(/'{2,}/g, '')
  .replace(/\s+/g, ' ')
  .trim()

const getHash = (i) => {
  return _hash(
    clean_string(i)
    .replace(/\.$/,'')
    .toLowerCase()
  )
}

const getHashesFromCommaSeperated = (i) => {
  return i.split(',').map(getHash)
}

// const get

// const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()
