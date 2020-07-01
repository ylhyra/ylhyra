import FindAGoodPositionForTooltip from 'Text/actions/TooltipPosition'
import AudioClip from 'Audio/AudioClip'
import { logShown } from './Reset'
import Analytics from 'text-plugin/Analytics/TextInteractions'

/*
  Show word
*/
export default function showWord(id) {
  // console.log(id)
  const tooltip = document.getElementById(`${id}-tooltip`)
  if (!tooltip) return;
  tooltip.classList.add('shown')
  logShown(`${id}-tooltip`)

  const element = document.getElementById(id)
  if (!element) return;
  element.classList.add('hover')
  logShown(id)

  let sound_files = element.getAttribute('data-sound')
  if (sound_files) {
    AudioClip.play(sound_files.split(','))
  }

  const connected = element.getAttribute('data-connected-words')
  if (connected) {
    connected.split(',').forEach(i => {
      addClass(i, 'hover')
      logShown(i)
    })
  }

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
