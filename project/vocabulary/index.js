import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'

const Render = () => {
  if (!isBrowser) return;
  if (mw.config.get('wgPageName') !== 'User:Egill/test2') return;

  const element = (
    <Provider store={store}>
      <div className="">
        <div id="overlay"></div>
      </div>
    </Provider>
  )
  ReactDOM.render(
    element,
    document.querySelector('.mw-parser-output')
  )
}
// export default Render
Render()
