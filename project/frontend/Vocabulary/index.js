import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import GameContainer from './Elements/GameContainer'

/*
  Test render container
*/
const Render = () => {
  return;
  if (!isBrowser) return;
  // if (typeof mw !== 'undefined' || mw.config.get('wgPageName') !== 'User:Egill/test2') return;

  const element = (
    <Provider store={store}>
      <div className="">
        <div id="overlay"></div>
        {/* <Table/> */}
        <GameContainer/>
      </div>
    </Provider>
  )
  // $('#mw-content-text').before('<div id="hehe"></div>')
  ReactDOM.render(
    element,
    document.querySelector('#mw-content-text')
  )
}

// export default Render
Render()
