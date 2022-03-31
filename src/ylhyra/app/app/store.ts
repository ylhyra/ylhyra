import error from "ylhyra/app/app/error/reducers";
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { route } from "ylhyra/app/router/reducers";
import { user } from "ylhyra/app/user/reducers";
import { vocabulary } from "ylhyra/app/vocabulary/reducers";
import { audio } from "ylhyra/documents/render/audio/reducers";
import { editor } from "ylhyra/maker/editor/reducers";
import { vocabularyMaker } from "ylhyra/maker/vocabulary_maker/reducers";
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
