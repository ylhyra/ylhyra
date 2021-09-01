// import { createBrowserHistory, createHashHistory } from 'history'
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { isBrowser } from "app/app/functions/isBrowser";

// import { data } from 'documents/Render/reducers'
import { audio } from "documents/render/audio/reducers";
// import { speed_reader } from 'documents/Render/Elements/Speed_reading/reducers'
import { vocabulary } from "app/vocabulary/reducers";
import { user } from "app/user/reducers";
import error from "app/app/error/reducers";
import { route } from "app/router/reducers";
import { vocabularyMaker } from "maker/vocabulary_maker/reducers";

/*
  Logger
*/
const extraMiddlewares = [];
if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`);
  extraMiddlewares.push(
    createLogger({
      collapsed: true,
    })
  );
}

const store = createStore(
  combineReducers({
    // /* Data storage for the renderer */
    // data,
    // /* Reader */
    audio,
    // inflection,
    // speed_reader,
    vocabulary,
    user,
    error,
    route,

    /* TEMP only for dev */
    vocabularyMaker,
  }),
  applyMiddleware(
    // routerMiddleware(history),
    thunk,
    ...extraMiddlewares
  )
);
export default store;

//temp
if (isBrowser) {
  window.store = store;
}
