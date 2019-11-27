import axios from 'axios'
import store from 'App/store'
import { push, replace } from 'react-router-redux'
import error from 'App/Error'
import stable_stringify from 'json-stable-stringify'


export const openEditor = (page) => {
  const newUrl = mw.util.getUrl(mw.config.get('wgPageName'), { editor: page });
  window.history.replaceState({}, '', newUrl)
  store.dispatch({
    type: 'OPEN_EDITOR',
    page,
  })
}
export const closeEditor = () => {
  const newUrl = mw.util.getUrl(mw.config.get('wgPageName'));
  window.history.replaceState({}, '', newUrl)
  purgeCurrentPage()
  store.dispatch({
    type: 'CLOSE_EDITOR',
  })
}



export const save = async () => {
  const title = mw.config.get('wgPageName')
  try {
    if (!store.getState().editor.isSaved) {
      const data = store.getState().editor

      const data_to_save = {
        tokenized: data.tokenized,
        list: data.list,
        translation: data.translation,
        suggestions: data.suggestions,
        short_audio: data.short_audio,
        // audio: data.audio,
        // pronunciation: data.pronunciation,
      }

      editPage({
        title: `Data:${title}`,
        text: stable_stringify(data_to_save, { space: 2 }),
        summary: '✏️',
      }, saved => {
        if (saved) {
          store.dispatch({
            type: 'SAVED',
          })
        } else {
          /* TODO Error */
        }
      })

      // TODO! Save translations in server as well
      // await axios.put(`/api/documents/${data.id}`, {
      //   data: data
      // })
    }
  } catch (e) {
    error('Unable to save document')
    console.error(e)
  }
}



/*
  Edit a MediaWiki page
*/
export const editPage = (info, callback) => {
  $.ajax({
      url: mw.util.wikiScript('api'),
      type: 'POST',
      dataType: 'json',
      data: {
        format: 'json',
        action: 'edit',
        title: info.title,
        text: info.text, // will replace entire page content
        summary: info.summary,
        token: mw.user.tokens.get('editToken')
      }
    })
    .done(function(data) {
      // console.log(data)
      if (data && data.edit && data.edit.result && data.edit.result == 'Success') {
        console.log(`Page edited! https://ylhyra.is/Special:Redirect/page/${data.edit.pageid}`);
        callback && callback(true)
      } else {
        console.warn('The edit query returned an error. =(');
        console.log(data)
        callback && callback(false)
      }
    })
    .fail(function() {
      console.warn('The ajax request failed.');
      callback && callback(false)
    })
}
export const purgeCurrentPage = () => {
  $.ajax({
      url: mw.util.wikiScript('api'),
      type: 'POST',
      dataType: 'json',
      data: {
        format: 'json',
        action: 'purge',
        titles: mw.config.get('wgPageName'),
        // token: mw.user.tokens.get('editToken')
      }
    })
    .done(function(data) {
      if (data && !data.warnings) {
        console.log('Page purged!');
        location.reload()
      } else {
        console.warn('The purge query returned an error. =(');
        console.log(data)
      }
    })
    .fail(function() {
      console.warn('The ajax request failed.');
    })
}


/*
  "Are you sure you want to close your window?"
  dialog when user has unsaved changes.
*/
if (process.env.NODE_ENV === 'production') {
  window.onbeforeunload = function(e) {
    if (!store.getState().editor.isSaved) {
      e.preventDefault()
      return ''
    }
  }
}
