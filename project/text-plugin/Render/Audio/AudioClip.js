let audio

const AudioClip = {
  play: (sound_files) => {
    audio && audio.pause()
    audio = new Audio(sound_files[0])
    const promise = audio.play()
    if (promise) {
      promise.catch(() => {
        // console.warn('Audio not played since user has not yet interacted with document')
      })
    }
  },
  pause: () => {
    audio && audio.pause()
    audio = null
  }
}

export default AudioClip


/*
  Needed if we put loading animations in:
*/
// var playPromise = video.play();
//
// if (playPromise !== undefined) {
//   playPromise.then(_ => {
//     // Automatic playback started!
//     // Show playing UI.
//   })
//   .catch(error => {
//     // Auto-play was prevented
//     // Show paused UI.
//   });
// }
