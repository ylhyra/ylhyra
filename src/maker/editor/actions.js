"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save2 = exports.save = exports.autosave = exports.closeEditor = exports.openEditor = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const error_1 = require("app/app/error");
const isBrowser_1 = require("app/app/functions/isBrowser");
const store_1 = __importDefault(require("app/app/store"));
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
// import { prettyPrint as relaxedJson } from 'really-relaxed-json'
// var relaxedJsonParser = require('really-relaxed-json').createParser()
const openEditor = (page) => {
    // const newUrl = mw.util.getUrl(store.getState().route.pathname, {
    //   editor: page,
    // });
    // window?.history.replaceState({}, "", newUrl);
    store_1.default.dispatch({
        type: "OPEN_EDITOR",
        page,
    });
};
exports.openEditor = openEditor;
const closeEditor = () => {
    if (!store_1.default.getState().editor.isSaved) {
        let ok = confirm("Are you sure you want to discard changes?");
        if (!ok)
            return;
    }
    // const newUrl = mw.util.getUrl(store.getState().route.pathname);
    // window?.history.replaceState({}, "", newUrl);
    store_1.default.dispatch({
        type: "CLOSE_EDITOR",
    });
};
exports.closeEditor = closeEditor;
exports.autosave = {
    on: () => {
        // Temporarily turn off autosave in development
        if (process.env.NODE_ENV !== "production") {
            return;
        }
        if (autosavePending) {
            return;
        }
        else {
            autosavePending = true;
            autosaveTimer = setTimeout(exports.save, 2 * 60 * 1000); // Two minutes
        }
    },
    off: () => {
        autosaveTimer && clearTimeout(autosaveTimer);
        autosavePending = false;
    },
};
let autosavePending = false;
let autosaveTimer;
const save = () => __awaiter(void 0, void 0, void 0, function* () {
    const title = store_1.default.getState().route.data.header.title;
    try {
        if (!store_1.default.getState().editor.isSaved) {
            const data = store_1.default.getState().editor;
            const data_to_save = {
                tokenized: data.tokenized,
                list: data.list,
                translation: data.translation,
                suggestions: data.suggestions,
                analysis: data.analysis,
                short_audio: data.short_audio,
                long_audio: data.long_audio,
                // pronunciation: data.pronunciation,
            };
            /* Test version using Relaxed JSON */
            // console.log(relaxedJson({
            //   arrayItemNewline: true,
            //   objectItemNewline: true,
            //   // indentLevel: 1,
            // }, stable_stringify(data_to_save,
            //   // { space: { toString: () => ''/*Workaround for zero spaces*/ } }
            // )))
            // console.log(relaxedJsonParser.stringToValue())
            // console.log(stable_stringify(data_to_save, { space: { toString: () => '' /*Workaround for zero spaces*/ } }))
            yield axios_1.default.post(`/api/translator/saveDocument`, {
                title: `${title}`,
                text: (0, json_stable_stringify_1.default)(data_to_save, {
                    space: {
                        toString: () => "" /*Workaround for zero spaces*/,
                    },
                }),
            });
            store_1.default.dispatch({
                type: "SAVED",
            });
            exports.autosave.off();
            // TODO! Save translations in server as well
            // await axios.put(`/api/documents/${data.id}`, {
            //   data: data
            // })
        }
    }
    catch (e) {
        (0, error_1.notify)("Unable to save document");
        console.error(e);
    }
});
exports.save = save;
/*
  WORK IN PROGRESS
  Save translations in server
*/
const save2 = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = store_1.default.getState().editor;
    yield axios_1.default.put(`/api/save`, {
        data: Object.assign({ document_id: mw.config.get("wgArticleId") }, data),
    });
});
exports.save2 = save2;
if (isBrowser_1.isBrowser) {
    window.save2 = exports.save2;
}
/*
  "Are you sure you want to close your window?"
  dialog when user has unsaved changes.
*/
if (process.env.NODE_ENV === "production" && window) {
    window.onbeforeunload = function (e) {
        if (!store_1.default.getState().editor.isSaved) {
            e.preventDefault();
            return "";
        }
    };
}
