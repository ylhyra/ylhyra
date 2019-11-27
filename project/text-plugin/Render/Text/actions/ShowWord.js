import FindAGoodPositionForTooltip from 'Text/actions/TooltipPosition'
import AudioClip from 'Audio/AudioClip'

/*
  Show word
*/
export default function showWord(id) {
  // console.log(id)
  const tooltip = document.querySelector(`[data-tooltip-id="${id}"]`)
  if (!tooltip) return;
  tooltip.classList.add('shown')

  const element = document.querySelector(`[data-word-id="${id}"]`)
  if (!element) return;
  element.classList.add('hover')

  let sound_files = element.getAttribute('data-sound')
  if (sound_files) {
    AudioClip.play(sound_files.split(','))
  }

  const connected = element.getAttribute('data-connected-words')
  if (connected) {
    connected.split(',').forEach(i => {
      addClass(`[data-word-id="${i}"]`, 'hover')
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
}








const addClass = (selector, css) => {
  const element = document.querySelector(selector)
  if (!element) return;
  element.classList.add(css)
}
