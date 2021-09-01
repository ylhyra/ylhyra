import axios from "app/app/axios"; //process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import React from "react";
import ReactDOM from "react-dom";
// import Inflection from 'documents/Render/Elements/Inflection'
import store from "app/app/store";
// import classify from 'server/inflection/tables/classification/BIN_classification.js'
import { without } from "underscore";
const url = "";
let cache = {};

export const ShowInflectionTable = async (input) => {
  // input = (typeof input === 'string') ? JSON.parse(input) : input
  // const { BIN_id, grammatical_tag } = input
  // if (!BIN_id) {
  //   return console.log('No BIN id')
  // }
  // let html = cache[JSON.stringify(input)]
  // if (!html) {
  //   const cats = classify({ grammatical_tag }).inflectional_form_categories.filter(i => typeof i !== 'number')
  //   html = (await axios.get(`/api/inflection?id=${BIN_id}&type=html&give_me=${cats.join(',')}`, {})).data
  //   cache[JSON.stringify(input)] = html
  // }
  // // console.log(html)
  // store.dispatch({
  //   type: 'LOAD_INFLECTION',
  //   content: html,
  // })
};
