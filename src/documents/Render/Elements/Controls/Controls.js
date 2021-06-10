import AudioPlayer from './Audio'
import exists from 'app/App/functions/exists'

export default (audioId, tree) => {
  // // let hasAudio = input.audio.file // TODO Update audio setup.
  // let needsAssist = CheckIfAssistIsNeeded(tree)
  // if (hasAudio || needsAssist) {
  //   return (
  //     <div className="controls">
  //       {AudioPlayer(input)}
  //       {needsAssist && (
  //         <div className="assistOnOff checkbox"
  //           data-checked="true"
  //           onClick="window.assistOnOff(this)"
  //           onTouchStart="window.assistOnOff(this)"
  //           >
  //           <span>Assist</span>
  //         </div>
  //       )}
  //     </div>
  //   )
  // }
  return null
}

/*
  The "Assist ON / OFF" toggle is only needed when:
    - A word is marked DIFFICULT
    - A word has INLINE TRANSLATION
*/
const CheckIfAssistIsNeeded = (tree) => {
  let needed = false
  const Traverse = (input, index = 0) => {
    if (!input) return null
    const { node, tag, attr, child, text } = input
    if (node === 'element' || node === 'root') {
      if (tag === 'word') {
        const { definition } = attr
        if (exists(definition) && (definition.difficult || definition.show_definition_above)) {
          needed = true
        }
      } else {
        !needed && child && child.map((e, i) => Traverse(e, i))
      }
    }
  }
  Traverse(tree)
  return needed
}
