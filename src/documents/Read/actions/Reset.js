import AudioClip from 'User/Render/Audio/AudioClip'
import store from 'User/App/store'
import Analytics from 'User/Analytics/TextInteractions'

var shownElements = []
export const logShown = (id) => {
  shownElements.push(id)
}

/*
  Reset
*/
export default function reset() {
  AudioClip.pause()

  Analytics.reset()

  shownElements.forEach(id => {
    // console.log(id)
    const el = document.getElementById(id)
    if(!el) return;
    el.classList.remove('shown')
    el.classList.remove('highlighted')
    el.classList.remove('hover')
  })
  shownElements = []

  if (Array.from(document.body.classList).includes('sentence-shown')) {
    store.dispatch({
      type: 'CLEAR_SENTENCE'
    })
    document.body.classList.remove('sentence-shown')
  }
}
