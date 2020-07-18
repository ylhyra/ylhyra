import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from 'react'
import ReactDOM from 'react-dom'
import Inflection from 'frontend/Render/Elements/Inflection'
import store from 'App/store'
import { classify } from './classify'
import { without } from 'underscore'

export const ShowInflectionTable = async (input) => {
  input = JSON.parse(input)
  const { BIN_id, grammatical_tag } = input
  if(!BIN_id) {
    return console.log('No BIN id')
  }
  const relevantCellValues = without(classify({ grammatical_tag }), '1', '2', '3')
  const rows = (await axios.get(`${url}/api/inflection/${BIN_id}`, {})).data
  if (!rows) return;
  store.dispatch({
    type: 'LOAD_INFLECTION',
    content: {
      rows,
      relevantCellValues,
    }
  })
}
