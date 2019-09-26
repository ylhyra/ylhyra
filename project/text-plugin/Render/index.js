import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Traverse from './Traverse'

const Render = (parsed) => {
  if($('.mw-parser-output')) {
    ReactDOM.render(
      <Provider store={store}>
        <div className="ylhyra-text">
          {Traverse(parsed)}
          <div id="overlay"></div>
        </div>
      </Provider>,
      document.querySelector('.mw-parser-output')
    )
  }
}
export default Render
