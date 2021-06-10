import _ from 'underscore'
import { getPreviousID } from 'documents/Parse/Compiler/1_Precompile/UpdateID'

export default (updatedID, editor) => {
  const { short_audio } = editor
  const id = getPreviousID(updatedID) || updatedID
  const text = (short_audio.wordID_to_text && short_audio.wordID_to_text[id])
  if(!text || !short_audio.sounds[text]) return '';
  return short_audio.sounds[text].join(',')
}
