import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Vocabulary, { VocabularyButton } from './index'
let i = 0

/* Initialize */
export const initVocabulary = () => {
  const elements = document.querySelectorAll('vocabulary:not(data-initialized)')
  let cards = {}
  elements && elements.forEach((e) => {
    e.setAttribute('data-initialized', 'true')
    const children = Array.from(e.querySelectorAll('card, .card'))
    if (children && children.length > 0) {
      cards[i] = children && children.map(c => {
        /*
          TEMP
        */
        /* Vocabulary card */
        if(c.dataset.values) {
          return JSON.parse(decodeURIComponent(c.dataset.values))
        }
        /* Conversation */
        else {
          return {
            type: 'vocabulary',
            content: c,
          }
        }
      })
      ReactDOM.render(
        <Provider store={store}>
          <VocabularyButton id={i}/>
        </Provider>, e)
      i++
    }
  })
  store.dispatch({
    type: 'CARDS',
    content: cards,
  })
}
