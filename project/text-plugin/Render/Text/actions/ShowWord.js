import FindAGoodPositionForTooltip from 'Text/actions/TooltipPosition'
import AudioClip from 'Audio/AudioClip'
import { logShown } from './Reset'
import Analytics from 'text-plugin/Analytics/TextInteractions'

/*
  Show word
*/
export default function showWord(id) {
  // console.log(id)
  const tooltip = document.querySelector(`[data-tooltip-id="${id}"]`)
  if (!tooltip) return;
  tooltip.classList.add('shown')
  logShown(tooltip)

  const element = document.querySelector(`[data-word-id="${id}"]`)
  if (!element) return;
  element.classList.add('hover')
  logShown(element)

  let sound_files = element.getAttribute('data-sound')
  if (sound_files) {
    AudioClip.play(sound_files.split(','))
  }

  const connected = element.getAttribute('data-connected-words')
  if (connected) {
    connected.split(',').forEach(i => {
      addClass(`[data-word-id="${i}"]`, 'hover')
      logShown(`[data-word-id="${i}"]`)
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

  addClass(`[data-box-id="${id}"]`, 'shown')
  logShown(`[data-box-id="${id}"]`)

  Analytics.show({ type: 'word', id })
}








const addClass = (selector, css) => {
  const element = document.querySelector(selector)
  if (!element) return;
  element.classList.add(css)
}
