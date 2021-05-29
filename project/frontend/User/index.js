/**
 * Users are logged in at login.ylhyra.is instead of the editor area at ylhyra.is
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import { Initialize } from './actions'
import User from './User'
/*
  Render container
*/
const Render = () => {
  if (!isBrowser) return;
  const element = (
    <Provider store={store}>
       <div className="">
         <User/>
       </div>
     </Provider>
  )
  $('header').after('<div id="user-container"></div>')
  ReactDOM.render(
    element,
    document.querySelector('#user-container')
  )
}

Render()
Initialize()
