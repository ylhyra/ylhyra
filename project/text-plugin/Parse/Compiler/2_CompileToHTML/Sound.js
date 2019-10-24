import _ from 'underscore'
import { getPreviousID } from 'Parse/Compiler/1_Precompile/UpdateID'
// import store from 'App/store'

export default (updatedID, editor) => {
  const { short_audio } = editor
  const id = getPreviousID(updatedID) || updatedID
  const text = (short_audio.wordID_to_text && short_audio.wordID_to_text[id])
  // console.log({
  //   id,
  //   updatedID,
  //   text,
  //   sounds:  short_audio.sounds[text]
  // })
  return short_audio.sounds[text].join(',')
}
