import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
// import Inflection from 'frontend/Render/Elements/Inflection'
import store from 'App/store'
import { without } from 'underscore'

export const ShowInflectionTable = async (input) => {
  // const rows = (await axios.get(`${url}/api/inflection/id/${BIN_id}`, {})).data.results

  input = (typeof input === 'string') ? JSON.parse(input) : input
  const { BIN_id, grammatical_tag } = input
  if (!BIN_id) {
    return console.log('No BIN id')
  }
  const html = (await axios.get(`${url}/api/inflection?id=${BIN_id}&type=html`, {})).data
  // console.log(html)
  store.dispatch({
    type: 'LOAD_INFLECTION',
    content: html,
  })
}
