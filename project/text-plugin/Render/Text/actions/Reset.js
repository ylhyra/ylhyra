import AudioClip from 'Audio/AudioClip'
import store from 'App/store'
import Analytics from 'text-plugin/Analytics/TextInteractions'

var shownElements = []
export const logShown = (element) => {
  shownElements.push(element)
}

/*
  Reset
*/
export default function reset(id) {
  AudioClip.pause()

  Analytics.reset()

  shownElements.forEach(element => {
    $(element).removeClass('shown highlighted hover')
  })
  shownElements = []

  if (Array.from(document.body.classList).includes('sentence-shown')) {
    store.dispatch({
      type: 'CLEAR_SENTENCE'
    })
    document.body.classList.remove('sentence-shown')
  }
}
