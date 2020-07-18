import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Traverse from './Traverse'
import { html2json, json2html } from 'frontend/App/functions/html2json'
import { ReadAlongSetup } from 'frontend/Render/Audio/ReadAlong'
import error from 'App/Error'
import Inflection from 'Render/Elements/Inflection'

const Render = (parsed, { shouldReturnElement, hydrate }) => {
  const element = (
    <Provider store={store}>
      <div className="ylhyra-text">
        {Traverse(parsed)}
        <div id="overlay"></div>
      </div>
      <Inflection/>
    </Provider>
  )
  setTimeout(function() {
    ReadAlongSetup() // Temporary, needs a better solution
  }, 200)

  if (shouldReturnElement) {
    return element
  } else {
    try {
      if ($('.mw-parser-output')) {
        if (hydrate /*&& $('.mw-parser-output > #hydrate').length > 0*/) {
          ReactDOM.render(
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
    } catch (e) {
      console.error(e)
      error('Could not initialize')
    }
  }
}
export default Render
