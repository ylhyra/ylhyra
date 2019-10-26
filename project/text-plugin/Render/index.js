import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Traverse from './Traverse'
import { html2json, json2html } from 'text-plugin/App/functions/html2json'

const Render = (parsed, { shouldReturnElement, hydrate }) => {
  console.log(json2html(parsed))
  const element = (
    <Provider store={store}>
      <div className="ylhyra-text">
        {Traverse(parsed)}
        <div id="overlay"></div>
      </div>
    </Provider>
  )

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
