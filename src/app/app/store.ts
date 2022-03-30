// import { createBrowserHistory, createHashHistory } from 'history'
import error from "app/app/error/reducers";
import { isBrowser } from "app/app/functions/isBrowser";
import { route } from "app/router/reducers";
import { user } from "app/user/reducers";
import { vocabulary } from "app/vocabulary/reducers";
import { audio } from "documents/render/audio/reducers";
import { editor } from "maker/editor/reducers";
import { vocabularyMaker } from "maker/vocabulary_maker/reducers";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

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

    /* TEMP only for isDev */
    vocabularyMaker,
    editor,
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
