import store from 'app/App/store'
import { soundAttribution as Attribution } from 'documents/Render/Attribution'
/*
  Short audio clips, like words on hover, that do not require an audio player interface
*/

let audio

const AudioClip = {
  play: (sound_files) => {
    if(store.getState().speed_reader.started) return;

    audio && audio.pause()
    let file
    if (Array.isArray(sound_files)) {
      file = sound_files[0]
    } else if (/, /.test(sound_files)) {
      file = sound_files.split(', ')[0]
    } else {
      file = sound_files
    }
    Attribution({ filename: file }) /* If we need to attribute a third party */
    audio = new Audio(file)
    const promise = audio.play()
    if (promise) {
      promise.catch((e) => {
        console.warn(e)
        // console.warn('Audio not played since user has not yet interacted with document')
      })
    }

    store.dispatch({
      type: 'CURRENTLY_PLAYING',
      content: file,
    })
  },
  pause: () => {
    audio && audio.pause()
    audio = null
  }
}

export default AudioClip
