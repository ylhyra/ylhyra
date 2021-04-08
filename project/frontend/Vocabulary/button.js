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

  const { data } = await axios.get(`https://ylhyra.is/index.php?title=${url}&action=raw&ctype=text/json&random=${Math.random()}`)


  let tmp_deck = []
  data.split('*').forEach(line => {
    // console.log(line)
    const x = line.match(/(.+) = (.+)/)
    if (!x) return;
    const front = x[0]
    const back = x[1]
    tmp_deck.push({ is: front, en: back })
  })


  let cards_data = []
  tmp_deck.forEach(({ is, en }) => {
    const hash = _hash(is.trim())
    cards_data.push({ is, en, from: 'is', belongs_to: hash, id: hash + '_is' })
    cards_data.push({ is, en, from: 'en', belongs_to: hash, id: hash + '_en' })
  })
  console.log({cards_data,tmp_deck,data})
  return null;


  return <button onClick={()=>loadDeck(cards_data)}>Learn vocabulary</button>
}

export const tmp_load (title) => {
  const { data } = await axios.get(`https://ylhyra.is/index.php?title=${url}&action=raw&ctype=text/json&random=${Math.random()}`)

  let tmp_deck = []
  data.split('*').forEach(line => {
    // console.log(line)
    const x = line.match(/(.+) = (.+)/)
    if (!x) return;
    const front = x[0]
    const back = x[1]
    tmp_deck.push({ is: front, en: back })
  })


  let cards_data = []
  tmp_deck.forEach(({ is, en }) => {
    const hash = _hash(is.trim())
    cards_data.push({ is, en, from: 'is', belongs_to: hash, id: hash + '_is' })
    cards_data.push({ is, en, from: 'en', belongs_to: hash, id: hash + '_en' })
  })
  console.log({cards_data,tmp_deck,data})
  return null;


  return <button onClick={()=>loadDeck(cards_data)}>Learn vocabulary</button>
}
