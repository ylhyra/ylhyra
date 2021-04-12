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

const file_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?gid=0&single=true&output=tsv`

/*
  Convert vocabulary data into a JavaScrip object
*/
export const tmp_load = async(title) => {
  // const { data } = await axios.get(`https://ylhyra.is/index.php?title=Vocabulary:${mw.util.wikiUrlencode(title)}&action=raw`)
  //
  // let tmp_deck = []
  // data.split('\n').forEach(line => {
  //   if (!line.trim()) return;
  //   const x = line.match(/(.+)(?: = |\t)(.+)/)
  //   if (!x) return;
  //   const front = x[1]
  //   const back = x[2]
  //   tmp_deck.push({ is: front, en: back })
  // })
  //
  // let cards_data = []
  // tmp_deck.forEach(({ is, en }) => {
  //   const hash = _hash(is.trim())
  //   cards_data.push({ is, en, from: 'is', belongs_to: hash, id: hash + '_is' })
  //   cards_data.push({ is, en, from: 'en', belongs_to: hash, id: hash + '_en' })
  // })
  // // console.log({ cards_data, tmp_deck, data })
  // // return null;
  //
  // // if(cards_data.length > 0)
  // console.log(data)
  // loadDeck(cards_data)
  //
  // // return <button onClick={()=>loadDeck(cards_data)}>Learn vocabulary</button>

  const { data } = await axios.get(file_url)
  data.split('\n').slice(1).slice(0,30).forEach(line => {
    const [
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
    console.log(icelandic)
  })
}
setTimeout(()=>{
  tmp_load()
},1000)
