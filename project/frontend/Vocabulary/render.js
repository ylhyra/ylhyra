import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import Router from 'Vocabulary/screens/router'
/*
  Render container
*/
const Render = () => {
  if (!isBrowser) return;
  if (
    typeof mw === 'undefined' ||
    mw.config.get('wgPageName') !== 'Text:Vocabulary'
  ) return;
  const element = (
    <Provider store={store}>
      <div className="">
        <div id="vocabulary">
          <Router/>
        </div>
      </div>
    </Provider>
  )
  // $('#mw-content-text').before('<div id="hehe"></div>')
  ReactDOM.render(
    element,
    document.querySelector('#mw-content-text')
  )
}
Render()
