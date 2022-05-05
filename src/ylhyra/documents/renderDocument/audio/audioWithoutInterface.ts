import store from "ylhyra/app/app/store";

/**
 * Short audio clips, like words on hover, that do not require an audio player interface
 *
 * Used by Card in Vocabulary
 */

let audio: HTMLAudioElement;

const AudioClip = {
  play: (files) => {
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
        audio.play().catch((e) => {
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
