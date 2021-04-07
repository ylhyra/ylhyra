import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import GameContainer from './Elements/GameContainer'

export default (props) => {
  console.log(props)
  return <button onClick={()=>store.dispatch({ type: 'LOAD_CARD' })}>Learn vocabulary</button>
}
