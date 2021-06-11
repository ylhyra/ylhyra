// import { createBrowserHistory, createHashHistory } from 'history'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

// import { data } from 'documents/Render/reducers'
// import { audio } from 'documents/Render/Audio/reducers'
// import { speed_reader } from 'documents/Render/Elements/Speed_reading/reducers'
import { vocabulary } from 'app/Vocabulary/reducers'
import { user } from 'app/User/reducers'
import error from 'app/App/Error/reducers'
import { route } from 'app/Router/reducers'

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
    route,
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