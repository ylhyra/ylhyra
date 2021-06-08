// import { createBrowserHistory, createHashHistory } from 'history'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { ConnectedRouter, routerReducer as routing, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

// import { data } from 'User/Render/reducers'
// import { audio } from 'User/Render/Audio/reducers'
// import { speed_reader } from 'User/Render/Elements/Speed_reading/reducers'
import { vocabulary } from 'User/Vocabulary/reducers'
import { user } from 'User/User/reducers'
import error from 'User/App/Error/reducers'

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
    // /* Data storage for the renderer */
    // data,
    // /* Reader */
    // audio,
    // inflection,
    // speed_reader,
    vocabulary,
    user,
    error,
  }),
  applyMiddleware(
    // routerMiddleware(history),
    thunk,
    ...extraMiddlewares,
  ),
)
export default store

//temp
window.store = store
