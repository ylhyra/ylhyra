import axios from 'axios'
import store from 'App/store'
import { push, replace } from 'react-router-redux'
import error from 'App/Error'
import stable_stringify from 'json-stable-stringify'

export const save = async () => {
  const title = mw.config.get('wgTitle')
  try {
    if (!store.getState().editor.isSaved) {
      const data = store.getState().editor

      const data_to_save = {
        tokenized: data.tokenized,
        list: data.list,
        // suggestions: data.suggestions,
        translation: data.translation,
      }

      editPage({
        title: `Data:${title}`,
        text: stable_stringify(data_to_save, {space:2}),
        summary: 'Saving data',
      }, saved => {
        if(saved) {
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
function editPage(info, callback) {
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
      if (data && data.edit && data.edit.result && data.edit.result == 'Success') {
        console.log('Page edited!');
        callback(true)
      } else {
        console.warn('The edit query returned an error. =(');
        console.log(data)
        callback(false)
      }
    })
    .fail(function() {
      console.warn('The ajax request failed.');
      callback(false)
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
