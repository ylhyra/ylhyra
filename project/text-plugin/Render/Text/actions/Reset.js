import AudioClip from 'Audio/AudioClip'
import store from 'App/store'

/*
  Reset
*/
export default function reset(id) {
  AudioClip.pause()
  // return
  const old = document.querySelectorAll(`.shown, .highlighted, .hover`)
  old.forEach(e => {
    e.classList.remove('shown', 'highlighted', 'hover')
  })

  if(Array.from(document.body.classList).includes('sentence-shown')) {
    store.dispatch({
      type: 'CLEAR_SENTENCE'
    })
    document.body.classList.remove('sentence-shown')
  }
}
