import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import GameContainer from './Elements/GameContainer'
import { loadDeck } from './deck'
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'

export default (props) => {
  const title = props.children[0]
  return (
    <div>
      <button onClick={()=>tmp_load(title)}>Learn vocabulary</button>
      <GameContainer/>
    </div>
  )
}

/*
  Convert vocabulary data into a JavaScrip object
*/
export const tmp_load = async (title) => {
  // console.log(mw.util.wikiUrlencode(title))
  // return;
  const { data } = await axios.get(`https://ylhyra.is/index.php?title=Vocabulary:${mw.util.wikiUrlencode(title)}&action=raw`)

  let tmp_deck = []
  data.split('\n').forEach(line => {
    if (!line.trim()) return;
    const x = line.match(/(.+)(?: = |\t)(.+)/)
    if (!x) return;
    const front = x[1]
    const back = x[2]
    tmp_deck.push({ is: front, en: back })
  })

  let cards_data = []
  tmp_deck.forEach(({ is, en }) => {
    const hash = _hash(is.trim())
    cards_data.push({ is, en, from: 'is', belongs_to: hash, id: hash + '_is' })
    cards_data.push({ is, en, from: 'en', belongs_to: hash, id: hash + '_en' })
  })
  // console.log({ cards_data, tmp_deck, data })
  // return null;

  // if(cards_data.length > 0)
  console.log(data)
  loadDeck(cards_data)

  // return <button onClick={()=>loadDeck(cards_data)}>Learn vocabulary</button>
}
