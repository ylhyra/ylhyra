import axios from "ylhyra/app/app/axios";
import { notify } from "ylhyra/app/app/error";
import { isBrowser } from "modules/isBrowser";
import store from "ylhyra/app/app/store";
import stable_stringify from "json-stable-stringify";

// import { prettyPrint as relaxedJson } from 'really-relaxed-json'
// var relaxedJsonParser = require('really-relaxed-json').createParser()

export const openEditor = (page) => {
  // const newUrl = mw.util.getUrl(store.getState().route.pathname, {
  //   editor: page,
  // });
  // window?.history.replaceState({}, "", newUrl);
  store.dispatch({
    type: "OPEN_EDITOR",
    page,
  });
};

export const closeEditor = () => {
  if (!store.getState().editor.isSaved) {
    let ok = confirm("Are you sure you want to discard changes?");
    if (!ok) return;
  }
  // const newUrl = mw.util.getUrl(store.getState().route.pathname);
  // window?.history.replaceState({}, "", newUrl);
  store.dispatch({
    type: "CLOSE_EDITOR",
  });
};

export const autosave = {
  on: () => {
    // Temporarily turn off autosave in development
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    if (autosavePending) {
      return;
    } else {
      autosavePending = true;
      autosaveTimer = setTimeout(save, 2 * 60 * 1000); // Two minutes
    }
  },
  off: () => {
    autosaveTimer && clearTimeout(autosaveTimer);
    autosavePending = false;
  },
};
let autosavePending = false;
let autosaveTimer;

export const save = async () => {
  const title = store.getState().route.data.header.title;
  try {
    if (!store.getState().editor.isSaved) {
      const data = store.getState().editor;

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

      await axios.post(`/api/translator/saveDocument`, {
        title: `${title}`,
        text: stable_stringify(data_to_save, {
          space: {
            toString: () => "" /*Workaround for zero spaces*/,
          },
        }),
      });

      store.dispatch({
        type: "SAVED",
      });
      autosave.off();

      // TODO! Save translations in server as well
      // await axios.put(`/api/documents/${data.id}`, {
      //   data: data
      // })
    }
  } catch (e) {
    notify("Unable to save document");
    console.error(e);
  }
};

/*
  WORK IN PROGRESS
  Save translations in server
*/
export const save2 = async () => {
  const data = store.getState().editor;
  await axios.put(`/api/save`, {
    data: {
      document_id: mw.config.get("wgArticleId"),
      ...data,
    },
  });
};
if (isBrowser) {
  window.save2 = save2;
}

/*
  "Are you sure you want to close your window?"
  dialog when user has unsaved changes.
*/
if (process.env.NODE_ENV === "production" && window) {
  window.onbeforeunload = function (e) {
    if (!store.getState().editor.isSaved) {
      e.preventDefault();
      return "";
    }
  };
}
