import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
import Inflection from 'frontend/Render/Elements/Inflection'
import store from 'App/store'
import { classify } from './classify'
import { without } from 'underscore'

export const ShowInflectionTable = async (input) => {
  input = (typeof input === 'string') ? JSON.parse(input) : input
  const { BIN_id, grammatical_tag } = input
  if (!BIN_id) {
    return console.log('No BIN id')
  }
  let relevantCellValues = without(classify({ grammatical_tag }), '1', '2', '3').filter(Boolean)
  if (relevantCellValues.length < 1) {
    relevantCellValues = null
  }
  const rows = (await axios.get(`${url}/api/inflection/id/${BIN_id}`, {})).data.results
  console.log(rows)
  if (!rows) return;
  store.dispatch({
    type: 'LOAD_INFLECTION',
    content: {
      rows,
      relevantCellValues,
    }
  })
}
