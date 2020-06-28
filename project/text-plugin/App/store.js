// import { createBrowserHistory, createHashHistory } from 'history'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { ConnectedRouter, routerReducer as routing, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import { editor } from 'Editor/reducers'
import { data } from 'Render/reducers'
import { audio } from 'Render/Audio/reducers'

/*
  Logger
*/
const extraMiddlewares = [];
if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`)
  extraMiddlewares.push(createLogger({
    collapsed: true,
  }))
}

const store = createStore(
  combineReducers({
    /* Editor */
    editor,
    /* Data storage for the renderer */
    data,
    /* Reader */
    audio,
  }),
  applyMiddleware(
    // routerMiddleware(history),
    thunk,
    ...extraMiddlewares,
  ),
)
export default store
