import FindAGoodPositionForTooltip from 'Render/Text/actions/TooltipPosition'
import AudioClip from 'Render/Audio/AudioClip'
import { logShown } from './Reset'
import Analytics from 'frontend/Analytics/TextInteractions'
import { ShowInflectionTable } from 'Render/Elements/Inflection/actions'

/*
  Keep track of which ID is currently shown.
  If the user is moving his curser too rapidly,
  main funciton may still be working on an old word.
*/
let currentId

/*
  Show word
*/
export default function showWord(id) {
  currentId = id

  // console.log(id)
  const tooltip = document.getElementById(`${id}-tooltip`)
  if (!tooltip) return;
  tooltip.classList.add('shown')
  logShown(`${id}-tooltip`)

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const element = document.getElementById(id)
  if (!element) return;
  element.classList.add('hover')
  logShown(id)

  if (id !== currentId) return; /* Exit if we're behind schedule */

  let sound_files = element.getAttribute('data-sound')
  if (sound_files) {
    AudioClip.play(sound_files.split(','))
  }

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const connected = element.getAttribute('data-connected-words')
  if (connected) {
    connected.split(',').forEach(i => {
      addClass(i, 'hover')
      logShown(i)
    })
  }

  /*
    Temporary: Inflection tables. Need to be moved into the compilation step.
  */
  const BIN_id = element.getAttribute('data-analysis')
  if (BIN_id) {
    ShowInflectionTable(BIN_id)
  }

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const { top, left } = FindAGoodPositionForTooltip({
    relative: tooltip.closest('.ylhyra-text').getBoundingClientRect(), // The text container will have "position:relative"
    tooltip: tooltip.getBoundingClientRect(),
    sentence: element.getBoundingClientRect(),
    // sentence_multiple_lines: this.props.clientRects || null
  })

  tooltip.style.top = Math.round(top) + 'px'
  tooltip.style.left = Math.round(left) + 'px'

  addClass(`${id}-box`, 'shown')
  logShown(`${id}-box`)

  Analytics.show({ type: 'word', id })
}





const addClass = (id, css) => {
  const element = document.getElementById(id)
  if (!element) return;
  element.classList.add(css)
}
