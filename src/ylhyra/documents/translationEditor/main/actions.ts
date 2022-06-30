// @ts-nocheck
import stable_stringify from "json-stable-stringify";
import { isBrowser } from "modules/isBrowser";
import { isProd } from "modules/isDev";
import axios from "ylhyra/app/app/axios";
import { notify } from "ylhyra/app/app/error";
import store from "ylhyra/app/app/store";

export function openEditor(page) {
  store.dispatch({
    type: "OPEN_EDITOR",
    page,
  });
}

export const closeEditor = () => {
  if (!store.getState().editor.isSaved) {
    // eslint-disable-next-line no-restricted-globals
    let ok = confirm("Are you sure you want to discard changes?");
    if (!ok) return;
  }
  store.dispatch({
    type: "CLOSE_EDITOR",
  });
};

export const autosave = {
  on: () => {
    if (!isBrowser) return;
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

      const dataToSave = {
        tokenized: data.tokenized,
        // list: data.list,
        translation: data.translation,
        // suggestions: data.suggestions,
        // analysis: data.analysis,
        // short_audio: data.short_audio,
        long_audio: data.long_audio,
        // pronunciation: data.pronunciation,
      };

      await axios.post(`/api/translator/saveTranslationData`, {
        title: `${title}`,
        text: stable_stringify(dataToSave, {
          // @ts-ignore
          space: {
            toString: () => "" /*Workaround for zero spaces*/,
          },
        }),
      });

      store.dispatch({
        type: "SAVED",
      });
      autosave.off();
    }
  } catch (e) {
    notify("Unable to save document");
    console.error(e);
  }
};

/*
  "Are you sure you want to close your window?"
  dialog when user has unsaved changes.
*/
if (!isProd && isBrowser) {
  window.onbeforeunload = function (e) {
    if (!store.getState().editor.isSaved) {
      e.preventDefault();
      return "";
    }
  };
}
