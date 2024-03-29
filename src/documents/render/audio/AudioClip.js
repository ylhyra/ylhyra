import store from "app/app/store";
// import { soundAttribution as Attribution } from "documents/Render/Attribution";
/*
  Short audio clips, like words on hover, that do not require an audio player interface
*/

let audio;

const AudioClip = {
  play: (files) => {
    if (store.getState().speed_reader && store.getState().speed_readerstarted)
      return;
    AudioClip.pause();
    if (!Array.isArray(files)) {
      files = [files];
    }

    audio = new Audio();
    let i = 0;
    const next = () => {
      if (i < files.length) {
        audio.src = files[i++];
        audio.load();
        const promise = audio.play();
        promise.catch((e) => {
          console.warn(e);
        });
      } else {
        audio?.removeEventListener("ended", next, false);
      }
    };
    audio.addEventListener("ended", next);
    next();

    store.dispatch({
      type: "CURRENTLY_PLAYING",
      content: files[0],
    });
  },
  pause: () => {
    audio?.pause();
    audio = null;
  },
};

export default AudioClip;
