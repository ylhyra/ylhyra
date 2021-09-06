import axios from "app/app/axios";
import store from "app/app/store";
import error from "app/app/error";
import stable_stringify from "json-stable-stringify";

// import { prettyPrint as relaxedJson } from 'really-relaxed-json'
// var relaxedJsonParser = require('really-relaxed-json').createParser()

export const openEditor = (page) => {
  const newUrl = mw.util.getUrl(mw.config.get("wgPageName"), { editor: page });
  window?.history.replaceState({}, "", newUrl);
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
  const newUrl = mw.util.getUrl(mw.config.get("wgPageName"));
  window?.history.replaceState({}, "", newUrl);
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
  const title = mw.config.get("wgPageName");
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

      editPage(
        {
          title: `Data:${title}`,
          text: stable_stringify(data_to_save, {
            space: { toString: () => "" /*Workaround for zero spaces*/ },
          }),
          summary: "✏️",
        },
        (saved) => {
          if (saved) {
            store.dispatch({
              type: "SAVED",
            });
            autosave.off();
          } else {
            // error('Could not save! Edit token probably old')
            console.log(stable_stringify(data_to_save, { space: 2 }));
            /* TODO Error */
          }
        }
      );

      // TODO! Save translations in server as well
      // await axios.put(`/api/documents/${data.id}`, {
      //   data: data
      // })
    }
  } catch (e) {
    error("Unable to save document");
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
window.save2 = save2;

/*
  Edit a MediaWiki page
*/
export const editPage = (info, callback) => {
  getNewEditToken((token) => {
    $.ajax({
      url: mw.util.wikiScript("api"),
      type: "POST",
      dataType: "json",
      data: {
        format: "json",
        action: "edit",
        title: info.title,
        text: info.text, // will replace entire page content
        summary: info.summary,
        token: token, // mw.user.tokens.get('editToken')
      },
    })
      .done(function (data) {
        // console.log(data)
        if (data?.edit && data.edit.result && data.edit.result === "Success") {
          console.log(
            `Page edited! https://ylhyra.is/Special:Redirect/page/${data.edit.pageid}`
          );
          callback && callback(true);
        } else {
          error("Could not save! Edit token probably old");
          console.warn("The edit query returned an error. =(");
          console.log(data);
          callback && callback(false);
        }
      })
      .fail(function () {
        console.warn("The ajax request failed.");
        callback && callback(false);
      });
  });
};

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
