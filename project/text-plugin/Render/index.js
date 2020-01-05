import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Traverse from './Traverse'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import { ReadAlongSetup } from 'text-plugin/Render/Audio/ReadAlong'

const Render = (parsed, { shouldReturnElement, hydrate }) => {
  // console.log(json2html(parsed))
  const element = (
    <Provider store={store}>
      <div className="ylhyra-text">
        {Traverse(parsed)}
        <div id="overlay"></div>
      </div>
    </Provider>
  )
  setTimeout(function(){
    ReadAlongSetup() // Temporary, needs a better solution
  }, 200)

  if (shouldReturnElement) {
    return element
  } else {
    if ($('.mw-parser-output')) {
      if (hydrate) {
        ReactDOM.hydrate(
          element,
          document.querySelector('.mw-parser-output')
        )
      } else {
        ReactDOM.render(
          element,
          document.querySelector('.mw-parser-output')
        )
      }
    }
  }
}
export default Render
