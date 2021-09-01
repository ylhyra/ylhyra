import { reset } from "./ReadAlong";
// import { getAudioElement, pausePlay, updateInterface } from './AudioPlayer'

// /*
//   KEYBOARD LISTENER
//   TODO
// */
// window.addEventListener('keydown', (e) => {
//   const audioElement = getAudioElement()
//   if (!audioElement) return;
//
//   // Space bar
//   if (e.keyCode === 32) {
//     pausePlay()
//     if (!document.querySelector(':focus,:active')) {
//       e.preventDefault()
//     }
//   }
//
//   /*
//     Skip 10 seconds ahead with Left/Right arrows.
//     TODO: This should ideally jump forwards to NEXT SENTENCE,
//           not just based on seconds. But this functionaily is
//           probably not necessary.
//   */
//   // Left
//   else if (e.keyCode === 37) {
//     audioElement.currentTime -= 10 // Skip 10 seconds backwards
//   }
//   // Right
//   else if (e.keyCode === 39) {
//     audioElement.currentTime += 10 // Skip 10 seconds ahead
//   }
//
//   // Escape|
//   else if (e.keyCode === 27) {
//     reset()
//   }
// })
