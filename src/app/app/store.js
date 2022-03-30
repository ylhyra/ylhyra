"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { createBrowserHistory, createHashHistory } from 'history'
const reducers_1 = __importDefault(require("app/app/error/reducers"));
const isBrowser_1 = require("app/app/functions/isBrowser");
const reducers_2 = require("app/router/reducers");
const reducers_3 = require("app/user/reducers");
const reducers_4 = require("app/vocabulary/reducers");
const reducers_5 = require("documents/render/audio/reducers");
const reducers_6 = require("maker/editor/reducers");
const reducers_7 = require("maker/vocabulary_maker/reducers");
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
/*
  Logger
*/
const extraMiddlewares = [];
if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require(`redux-logger`);
    extraMiddlewares.push(createLogger({
        collapsed: true,
    }));
}
const store = (0, redux_1.createStore)((0, redux_1.combineReducers)({
    // /* Data storage for the renderer */
    // data,
    // /* Reader */
    audio: reducers_5.audio,
    // inflection,
    // speed_reader,
    vocabulary: reducers_4.vocabulary,
    user: reducers_3.user,
    error: reducers_1.default,
    route: reducers_2.route,
    /* TEMP only for isDev */
    vocabularyMaker: reducers_7.vocabularyMaker,
    editor: reducers_6.editor,
}), (0, redux_1.applyMiddleware)(
// routerMiddleware(history),
redux_thunk_1.default, ...extraMiddlewares));
exports.default = store;
//temp
if (isBrowser_1.isBrowser) {
    window.store = store;
}
