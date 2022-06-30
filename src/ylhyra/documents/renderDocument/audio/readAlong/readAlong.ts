// @ts-nocheck
import { addClass, removeClass } from "modules/addCssClass";
import { Seconds } from "modules/time";
import store from "ylhyra/app/app/store";
import scrollIntoView from "ylhyra/documents/renderDocument/audio/readAlong/scroll/scrollIntoView";
import { LongAudioSyncData } from "ylhyra/documents/translationEditor/audioSynchronization/types";
import { FlattenedData } from "ylhyra/documents/types/types";

let audioIdToSyncData: { [id: string]: LongAudioSyncData[] } = {};
let sentenceIdToTimestamps: {
  [sentenceId: string]: {
    filename: string;
    begin: LongAudioSyncData["begin"];
    end: LongAudioSyncData["end"];
  };
} = {};
let started = false;
let previous: LongAudioSyncData | null;
let timer: NodeJS.Timeout;
let currentFilename: string | null;

export function readAlong(
  audio: HTMLAudioElement,
  type: "play" | "pause",
  filename: string
) {
  currentFilename = filename;
  if (!audioIdToSyncData[currentFilename]) return;

  /* Play */
  if (type === "play") {
    const time = audio.currentTime;
    if (
      !previous ||
      !previous.begin ||
      !(
        previous.begin <= time &&
        (time < previous.end || previous.end === null)
      )
    ) {
      const isPlaying = !audio.paused; /*&& type !== 'scrub'*/
      timer && clearTimeout(timer);
      showElementsByIndex(findElementIndexFromTime(time), time, isPlaying);
    }
    started = true;
  } else if (type === "pause") {
    /* Pause */
    timer && clearTimeout(timer);
  }
}

export const clearReadAlongSetup = () => {
  audioIdToSyncData = {};
  sentenceIdToTimestamps = {};
  currentFilename = null;
};

export function readAlongSetup(data: Partial<FlattenedData> | undefined) {
  if (!data || !data.long_audio) {
    return clearReadAlongSetup();
  }
  const { long_audio } = data;
  for (let filename of Object.keys(long_audio)) {
    const syncList = long_audio[filename].sync.list;
    audioIdToSyncData[filename] = syncList;
    /* Temp solution, would be better to do this in the audio synchronization step */
    for (const timePeriod of syncList) {
      for (const element of timePeriod.elements) {
        if (!sentenceIdToTimestamps[element]) {
          sentenceIdToTimestamps[element] = {
            filename,
            begin: timePeriod.begin,
            end: timePeriod.end,
          };
        } else {
          sentenceIdToTimestamps[element]["end"] = timePeriod.end;
        }
      }
    }
  }
}

/**
 * Find elements that should be shown at the current time.
 * We find the index in the LongAudioSyncData[] list in order
 * to be able to easily go to the next element.
 */
const findElementIndexFromTime = (time: Seconds) => {
  return audioIdToSyncData[currentFilename!].findIndex(({ begin, end }) => {
    return begin <= time && (time < end || end === null);
  });
};

/**
 * Show the elements for this time.
 * Set timer to repeat the process.
 * We use the index in the LongAudioSyncData[] list in
 * order to be able to easily go to the next element.
 */
const showElementsByIndex = (
  index: number,
  time?: Seconds,
  isPlaying = true
) => {
  if (!currentFilename) return;
  const current: LongAudioSyncData = audioIdToSyncData[currentFilename][index];
  if (!current) {
    return console.error(`Non-existent index sent to ${showElementsByIndex}`);
  }
  scrollIntoView(
    current.elements.filter((i) => !(previous && i in previous.elements))
  );
  addClass(
    current.elements.filter((i) => !(previous && i in previous.elements)),
    "audioPlaying"
  );
  previous &&
    removeClass(
      previous.elements.filter((i) => !(i in current.elements)),
      "audioPlaying"
    );
  if (isPlaying && index < audioIdToSyncData[currentFilename].length) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      showElementsByIndex(index + 1);
    }, (current.end - (time || current.begin)) * 1000);
  }
  previous = current;
};

/** Play audio for a single sentence */
export function readAlongSingleSentence(id: string) {
  if (sentenceIdToTimestamps[id]) {
    store.dispatch({
      type: "PLAY_SENTENCE",
      filename: sentenceIdToTimestamps[id].filename,
      begin: sentenceIdToTimestamps[id].begin,
      end: sentenceIdToTimestamps[id].end,
    });
  }
}
