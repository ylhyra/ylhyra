/*
  Short audio clips, like words on hover, that do not require an audio player interface
*/

let audio

const AudioClip = {
  play: (sound_files) => {
    audio && audio.pause()
    if (Array.isArray) {
      audio = new Audio(sound_files[0])
    } else {
      audio = new Audio(sound_files)
    }
    const promise = audio.play()
    if (promise) {
      promise.catch(() => {
        // console.warn('Audio not played since user has not yet interacted with document')
      })
    }

    // store.dispatch({
    //   type: 'CURRENTLY_PLAYING',
    //   content: this.state.data.file,
    // })
  },
  pause: () => {
    audio && audio.pause()
    audio = null
  }
}

export default AudioClip
