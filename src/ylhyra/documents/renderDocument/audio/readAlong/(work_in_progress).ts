/** Various work-in-progress snippets */

// /*
//   TEMPORARY SOLUTION
//   A very crude solution for finding which audio sections should be played
// */
// export function readAlongMessage (message, audioId) {
//   if (!message) return;
//   const ids = message.match(/ id=".+?"/g).map((i) => i.match(/id="(.+?)"/)[1]);
//   // console.log(message)
//   // console.log(ids)
//   let begins = [];
//   let ends = [];
//   ids.forEach((id) => {
//     if (sentences[id]) {
//       begins.push(sentences[id].begin);
//       ends.push(sentences[id].end);
//     }
//   });
//   // console.log({
//   //   begins,ends,
//   //   begin: begins.sort((a,b)=>a-b)[0],
//   //   end: ends.sort((a,b)=>b-a)[0],
//   // })
//   // return
//   store.dispatch({
//     type: "PLAY_SENTENCE",
//     audioId,
//     begin: begins.sort((a, b) => a - b)[0],
//     end: ends.sort((a, b) => b - a)[0],
//   });
// };

/**
 * Hasten all times by X seconds. It may be better to be a little quick,
 * to make the reader focus on the word before hearing the audio.
 *
 * (May not be necessary)
 */
// let time_shift = 0 // +0.050

/** Stuff in development: ******* */

/*
  // Highlight adjacent words
  // Might give the text reading a bit more flow.
  // (This has been temporarily removed since this style is not currently desireable)
  // To use this, add the following to the "Show()" function:
  //
  //      PreviewPrevious(index - 1)
  //      PreviewNext(index + 1)
  //

  let previous_PreviewNext = { elements: [] }
  const PreviewNext = (index, time, auto = true) => {
    const current = list[audioId][index] || { elements: [] }
    addClass(current.elements.filter(i => previous_PreviewNext.elements.indexOf(i) === -1), 'previewNext')
    removeClass(previous_PreviewNext.elements.filter(i => current.elements.indexOf(i) === -1), 'previewNext')
    previous_PreviewNext = current
  }

  let previous_PreviewPrevious = { elements: [] }
  const PreviewPrevious = (index, time, auto = true) => {
    const current = list[audioId][index] || { elements: [] }
    addClass(current.elements.filter(i => previous_PreviewPrevious.elements.indexOf(i) === -1), 'previewNext')
    removeClass(previous_PreviewPrevious.elements.filter(i => current.elements.indexOf(i) === -1), 'previewNext')
    previous_PreviewPrevious = current
  }
*/

/*
  // process.env.NODE_ENV === "development" testing for seeing events fired by audio

  setTimeout(() => {
   const myObj = document.querySelector('audio[data-id]')

   // myObj.addEventListener("pause", ()=>console.log('haha'));

   const myFunction = (event) => {
     console.log(event.type + " is fired")
   }
   for (var key of Object.keys(myObj)) {
     if (key.search('on') === 0) {
       if (key === 'onmousemove') return
       if (key === 'onpointermove') return
       myObj.addEventListener(key.slice(2), myFunction)
     }
   }
  }, 300)
*/

//
// const myObj = document.querySelector('audio > source')
// for (var key of Object.keys(myObj)) {
//   if (key.search('on') === 0) {
//     console.log(key)
//   }
// }
