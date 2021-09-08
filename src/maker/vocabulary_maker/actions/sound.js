import store from "app/app/store";
import {
  getDeckName,
  GetLowercaseStringForAudioKey,
} from "maker/vocabulary_maker/compile/functions";
import _ from "underscore";
import { deck } from "app/vocabulary/actions/deck";
import {
  cards,
  plaintext_sentences,
  save,
  sound,
} from "maker/vocabulary_maker/actions/actions";
import { withDependencies } from "app/vocabulary/actions/card/dependencies";

let missing_sound = [];
let current_word_recording = 0;
export const setupSound = () => {
  if (getDeckName()) return;
  let sentences = [];
  let ids = _.shuffle(deck.cards_sorted.filter((c) => c.sortKey))
    .sort((a, b) => Math.floor(a.sortKey / 50) - Math.floor(b.sortKey / 50))
    .map((c) => c.id);
  ids = withDependencies(ids);
  ids.forEach((id) => {
    if (!(id in cards)) return;
    cards[id].spokenSentences.forEach((sentence) => {
      if (!sentences.includes(sentence)) {
        sentences.push(sentence);
      }
    });
  });
  // console.log(sentences);
  // sentences = _.shuffle(sentences);

  missing_sound = [];
  current_word_recording = 0;
  sound = sound.map((i) => ({
    ...i,
    lowercase: GetLowercaseStringForAudioKey(i.recording_of),
  }));
  // Object.keys(plaintext_sentences)
  sentences.forEach((word) => {
    const lowercase = GetLowercaseStringForAudioKey(word);
    if (
      !sound.some(
        (i) =>
          i.lowercase === lowercase &&
          i.speaker === window.recording_metadata.speaker
      )
    ) {
      missing_sound.push(word);
    }
  });
  getNextWordToRecord();
};

export const getNextWordToRecord = () => {
  const remaining = `${current_word_recording} done today, ${
    missing_sound.length - current_word_recording
  } remaining. ${
    100 -
    Math.ceil(
      ((missing_sound.length - current_word_recording) /
        Object.keys(plaintext_sentences).length) *
        100
    )
  }% done overall.`;
  const word = missing_sound[current_word_recording++];
  store.dispatch({
    type: "VOCABULARY_TO_RECORD",
    content: {
      word,
      remaining,
    },
  });
};

export const saveSound = ({ word, filename }) => {
  console.log(filename);
  sound.push({
    recording_of: word,
    filename,
    speed: window.recording_metadata.speed,
    speaker: window.recording_metadata.speaker,
    date: new Date().toISOString().substring(0, 10),
  });
  save();
};
