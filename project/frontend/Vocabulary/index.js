import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import hash from 'project/frontend/App/functions/hash'
import test from './test'

const Render = () => {
  if (!isBrowser) return;
  if (mw && mw.config.get('wgPageName') !== 'User:Egill/test2') return;

  const element = (
    <Provider store={store}>
      <div className="">
        <div id="overlay"></div>
        <Table/>
      </div>
    </Provider>
  )
  $('#mw-content-text').before('<div id="hehe"></div>')
  ReactDOM.render(
    element,
    document.querySelector('#hehe')
  )
}

const Table = () => {
  return <table>
    <tbody>
      {test.map(({ is, en }) => (
        <tr><td><b>{is}</b></td><td>{en}</td></tr>
      ))}
    </tbody>
  </table>

}









// export default Render
Render()
