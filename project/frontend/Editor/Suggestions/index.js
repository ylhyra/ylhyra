/*
  Documentation:
  https://ylhyra.is/Software:Suggestions
*/
import React from 'react'
import store from 'App/store'
import { send } from 'Editor/web-socket'
import error from 'App/Error'

/*

  TODO Check if suggestions are needed before sending

*/
const MakeSuggestions = () => {
  const { list, tokenized, suggestions, translation } = store.getState().editor
  // Information is sent through a WebSocket
  console.log('%c [Requesting suggestions...]', 'color: RoyalBlue')
  // console.log(Cookies.get())
  return;
  // var api = new mw.Api();
  // api.get({
  //   action: 'session_verification',
  //   format: 'json'
  // }).done(function (data) {
  //   const session_verification_token = data.session_verification.token
  //   if(!session_verification_token) {
  //     error('Server could not verify that you are logged in')
  //     return console.log(data)
  //   }
  //   send({
  //     type: 'REQUEST_SUGGESTIONS',
  //     list: list,
  //     tokenized,
  //     suggestions,
  //     translation,
  //     session_verification_token,
  //     // from: metadata.from,
  //     // to: metadata.to,
  //   })
  // });
}

class SuggestionsStatus extends React.PureComponent {
  render() {
    return null
  }
}

export const receiveSuggestions = (action) => {}

export const applySuggestions = () => {
  const { list, translation, suggestions } = store.getState().editor
  for (let id in suggestions) {
    if (!(id in translation.words) && !(id in translation.sentences)) {
      if (id in list.words) {
        store.dispatch({
          type: 'UPDATE_DEFINITION',
          definition: suggestions[id][0].definition, // TODO! Other values like difficulty?
          selected: [id], // TODO!! "INCLUDES OTHER WORDS"
        })
      } else {
        store.dispatch({
          type: 'UPDATE_SENTENCE',
          content: suggestions[id][0].definition,
          sentence_id: id,
        })
      }
    }
  }
}

export default MakeSuggestions
export { SuggestionsStatus }
