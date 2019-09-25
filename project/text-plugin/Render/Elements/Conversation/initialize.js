import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Conversation from './index'
let id = 0

/* Initialize */
export const initConversation = () => {
  const elements = document.querySelectorAll('.conversation:not([data-initialized])')
  elements && elements.forEach((e) => {
    // console.log(e.innerHTML)
    // const audioId = e.dataset.id
    // const inline = e.dataset.inline
    // const src = e.dataset.src
    const audio = e.querySelector('.audioContainer')
    const conversation = ParseConversation(Array.from(e.children))
    e.setAttribute('data-initialized', 'true')
    ReactDOM.render(<Provider store={store}><Conversation id={id++} audio={audio} conversation={conversation}/></Provider>, e)
  })
}




/*  TEMP Used on Vocabulary/index.js, should be merged */
export const ParseConversationAndReturnElement = (card, section_id, cardIndex) => {
  const e = card.querySelector('.conversation:not([data-initialized])')
  const audio = e.querySelector('.audioContainer')
  const conversation = ParseConversation(Array.from(e.children))
  // console.log(card)
  return <Conversation id={id++} key={section_id+'_'+cardIndex} section_id={section_id} audio={audio} conversation={conversation}/>
}




/* Convert our temporary HTML to a workable object */
const ParseConversation = (elements) => {
  let output = []
  elements.forEach(element => {
    const classList = Array.from(element.classList)
    if (classList.includes('audioContainer')) {
      return
    }
    /* Message */
    if (classList.includes('message')) {
      output.push({
        type: 'message',
        from: classList.includes('me') ? 'me' : 'them',
        message: element.innerHTML,
      })
    }
    /* Answers */
    else {
      const data = element.getAttribute('data-values')
      if (!data) return;
      const values = JSON.parse(decodeURIComponent(data))
      output.push({
        type: 'answers',
        ...values,
      })
    }
  })
  // output = output.map((element, index) => {
  //   if(element.type === 'message') {
  //     return
  //   } else {
  //     return element
  //   }
  // })

  // ${message.instructions ? `
  //   <div class="instructions">${message.instructions}</div>
  // ` : ''}
  // <answers>
  //   ${message.answers.map((answer,index) => `
  //     <button data-correct="${index === message.correctIndex}">${answer}</button>
  //   `).join('')}
  // </answers>
  return output
}
