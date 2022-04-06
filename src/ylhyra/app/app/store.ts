import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import error from "ylhyra/app/app/error/reducers";
import { route } from "ylhyra/app/router/reducers";
import { user } from "ylhyra/app/user/reducers";
import { vocabulary } from "ylhyra/vocabulary/app/reducers";
import { audio } from "ylhyra/content/frontend/audio/reducers";
import { editor } from "ylhyra/content/translationEditor/main/reducers";
import { vocabularyMaker } from "ylhyra/vocabulary/vocabularyEditor/reducers";

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
  // window["store"] = store;
}
