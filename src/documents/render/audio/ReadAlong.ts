import ScrollIntoView from "documents/render/audio/Scroll/ScrollIntoView";
import { addClass, removeClass } from "documents/render/helpers";
import store from "app/app/store";

/*
  Hasten all times by X seconds. It may be better to be a little quick,
  to make the reader focus on the word before hearing the audio.

  (May not be necessary)
*/
// let time_shift = 0 // +0.050

/*

  List will be on this format, a list of timestamps
  and the elements that should be shown at that time:

  [{ begin: 0.000, end: 1.930, elements: [s0,w1] },
   { begin: 1.930, end: 2.315, elements: [s0,w2] }]

*/

let list = {};
let sentences = {};
let started = false;
let previous = { elements: [] };
let timer;
let currentAudioId;

/**
  ____  _____    _    ____       _    _     ___  _   _  ____
 |  _ \| ____|  / \  |  _ \     / \  | |   / _ \| \ | |/ ___|
 | |_) |  _|   / _ \ | | | |   / _ \ | |  | | | |  \| | |  _
 |  _ <| |___ / ___ \| |_| |  / ___ \| |__| |_| | |\  | |_| |
 |_| \_\_____/_/   \_\____/  /_/   \_\_____\___/|_| \_|\____|

  - audio: Will be the audio element
  - type: Can be [play, pause]
*/
export const ReadAlong = (audio, type, filename) => {
  currentAudioId = filename;
  if (!list[currentAudioId]) return;

  // Play
  if (type === "play") {
    const time = audio.currentTime;
    if (
      !previous.begin ||
      !(
        previous.begin <= time &&
        (time < previous.end || previous.end === null)
      )
    ) {
      const auto = !audio.paused; /*&& type !== 'scrub'*/
      timer && clearTimeout(timer);
      Show(FindIndexFromTime(time), time, auto);
    }
    started = true;
  }

  // Pause
  else if (type === "pause") {
    timer && clearTimeout(timer);
  }
};

export const clear = () => {
  list = {};
  sentences = {};
  currentAudioId = null;
};

export const ReadAlongSetup = (data) => {
  if (!data || !data.long_audio) {
    return clear();
  }
  const { long_audio } = data;
  for (let filename of Object.keys(long_audio)) {
    const synclist = long_audio[filename].sync.list;
    list[filename] = synclist;
    /* Temp solution, would be better to do this in the audio synchronization step */
    for (const section of synclist) {
      for (const element of section.elements) {
        if (!sentences[element]) {
          sentences[element] = {
            filename,
            begin: section.begin,
            end: section.end,
          };
        } else {
          sentences[element]["end"] = section.end;
        }
      }
    }
  }
};

/*
  Find elements that should be shown at this timeout
*/
const FindIndexFromTime = (time) => {
  return list[currentAudioId].findIndex(({ begin, end }) => {
    return begin <= time && (time < end || end === null);
  });
};

/*
  Show the elements for this time.
  Set timer to repeat the process.
*/
const Show = (index, time, auto = true) => {
  if (!currentAudioId) return;
  const current = list[currentAudioId][index] || { elements: [] };
  ScrollIntoView(
    current.elements.filter((i) => previous.elements.indexOf(i) === -1)
  );
  addClass(
    current.elements.filter((i) => previous.elements.indexOf(i) === -1),
    "audioPlaying"
  );
  removeClass(
    previous.elements.filter((i) => current.elements.indexOf(i) === -1),
    "audioPlaying"
  );
  if (auto && index < list[currentAudioId].length) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      Show(index + 1);
    }, (current.end - (time || current.begin)) * 1000);
  }
  previous = current;
};

export const reset = () => {
  removeClass(previous.elements);
  previous = { elements: [] };
};

/*
  Play audio for a single sentence
*/
export const ReadAlongSingleSentence = (id) => {
  // console.log(sentences[id])
  if (sentences[id]) {
    store.dispatch({
      type: "PLAY_SENTENCE",
      filename: sentences[id].filename,
      begin: sentences[id].begin,
      end: sentences[id].end,
    });
  }
};

/*
  TEMPORARY SOLUTION
  A very crude solution for finding which audio sections should be played
*/
export const ReadAlongMessage = (message, audioId) => {
  if (!message) return;
  const ids = message.match(/ id=".+?"/g).map((i) => i.match(/id="(.+?)"/)[1]);
  // console.log(message)
  // console.log(ids)
  let begins = [];
  let ends = [];
  ids.forEach((id) => {
    if (sentences[id]) {
      begins.push(sentences[id].begin);
      ends.push(sentences[id].end);
    }
  });
  // console.log({
  //   begins,ends,
  //   begin: begins.sort((a,b)=>a-b)[0],
  //   end: ends.sort((a,b)=>b-a)[0],
  // })
  // return
  store.dispatch({
    type: "PLAY_SENTENCE",
    audioId,
    begin: begins.sort((a, b) => a - b)[0],
    end: ends.sort((a, b) => b - a)[0],
  });
};

/******** Stuff in development: ********/

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
