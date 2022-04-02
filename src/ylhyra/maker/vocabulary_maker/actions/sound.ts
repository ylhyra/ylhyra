import _ from "underscore";
import store from "ylhyra/app/app/store";
import { getSortKey } from "ylhyra/app/vocabulary/actions/card/card_data";
import { deck } from "ylhyra/app/vocabulary/actions/deck";
import { withDependencies } from "ylhyra/app/vocabulary/actions/functions/dependencies";
import { Database, save } from "ylhyra/maker/vocabulary_maker/actions/actions";
import {
  getDeckName,
  GetLowercaseStringForAudioKey,
} from "ylhyra/maker/vocabulary_maker/compile/functions";

let missing_sound = [];
let current_word_recording = 0;
export const setupSound = () => {
  if (getDeckName()) return;
  let sentences = [];
  let ids = _.shuffle(deck.cards_sorted.filter((c) => getSortKey(c))).sort(
    (a, b) => Math.floor(getSortKey(a) / 50) - Math.floor(getSortKey(b) / 50)
  );
  ids = withDependencies(ids);
  ids.forEach((id) => {
    if (!(id in Database.cards)) return;
    Database.cards[id].spokenSentences.forEach((sentence) => {
      if (!sentences.includes(sentence)) {
        sentences.push(sentence);
      }
    });
  });
  // console.log(sentences);
  // sentences = _.shuffle(sentences);

  missing_sound = [];
  current_word_recording = 0;
  Database.sound = Database.sound.map((i) => ({
    ...i,
    lowercase: GetLowercaseStringForAudioKey(i.recording_of),
  }));
  // Object.keys(plaintext_sentences)
  sentences.forEach((word) => {
    const lowercase = GetLowercaseStringForAudioKey(word);
    if (
      !Database.sound.some(
        (i) =>
          i.lowercase === lowercase &&
          i.speaker === window["recording_metadata"].speaker
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
        Object.keys(Database.plaintext_sentences).length) *
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
  Database.sound.push({
    recording_of: word,
    filename,
    speed: window["recording_metadata"].speed,
    speaker: window["recording_metadata"].speaker,
    date: new Date().toISOString().substring(0, 10),
  });
  save();
};
