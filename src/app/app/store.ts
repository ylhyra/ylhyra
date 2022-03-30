import error from "app/app/error/reducers";
import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";
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
    // /* Reader */
    audio,
    vocabulary,
    user,
    error,
    route,
    /* TEMP only for isDev */
    vocabularyMaker,
    editor,
  }),
  applyMiddleware(thunk, ...extraMiddlewares)
);
export default store;

export type RootState = ReturnType<typeof store.getState>;

//temp
if (isDev && isBrowser) {
  window["store"] = store;
}
