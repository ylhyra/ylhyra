import { isBrowser } from "app/App/functions/isBrowser";
import {
  getHash,
  getHashesFromCommaSeperated,
  getRawTextFromVocabularyEntry,
  GetLowercaseStringForAudioKey,
  parse_vocabulary_file,
} from "app/VocabularyMaker/functions";
import store from "app/App/store";
import axios from "app/App/axios";
import _ from "underscore";

let maxID = 0;
let rows = [];
let sound = [];
let terms = {};
let dependencies = {};
let alternative_ids = {};
let raw_sentences = {};

export const MAX_PER_PAGE = 20;

export const load = async () => {
  let vocabulary = (await axios.get(`/api/vocabulary_maker`, {})).data;
  sound = vocabulary.sound;
  rows = vocabulary.rows;
  rows.forEach((i) => {
    maxID = Math.max(maxID, i.row_id);
  });
  // const parsed = parse(vocabulary)
  // terms = parsed.terms
  // dependencies = parsed.dependencies
  // alternative_ids = parsed.alternative_ids
  // raw_sentences = parsed.raw_sentences
  ({ terms, dependencies, alternative_ids, raw_sentences } =
    parse_vocabulary_file(vocabulary));
  setupSound();
  findMissingDependencies();
  refreshRows();
};

let selected_rows = [];
export const refreshRows = (id) => {
  rows =
    // _.shuffle(rows)
    rows.sort(
      (a, b) =>
        Boolean(a["Laga?"]) - Boolean(b["Laga?"]) ||
        Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
        Boolean(a.last_seen) - Boolean(b.last_seen) ||
        Boolean(a.english) - Boolean(b.english) ||
        (a.level || 100) - (b.level || 100)
    );
  selectRows();
  select(selected_rows[0].row_id);
};

export const selectRows = () => {
  selected_rows = rows.slice(0, MAX_PER_PAGE);
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: selected_rows,
  });
};

export const select = (id) => {
  store.dispatch({
    type: "VOCABULARY_MAKER_SELECT",
    content: id,
  });
};

export const selectNext = (row_id) => {
  const x =
    selected_rows[selected_rows.findIndex((j) => j.row_id === row_id) + 1];
  if (x && x.row_id) {
    select(x.row_id);
  } else {
    refreshRows();
  }
};

export const delete_row = (row_id) => {
  selectNext(row_id);
  rows.splice(
    rows.findIndex((j) => j.row_id === row_id),
    1
  );
  updateInterface();
};

export const submit = (vals, gotonext = true) => {
  vals.level = vals.level ? parseFloat(vals.level) : vals.level;
  rows[rows.findIndex((j) => j.row_id === vals.row_id)] = {
    ...vals,
    last_seen: new Date().toISOString().substring(0, 10),
  };
  updateInterface();
  // select(null);
  if (gotonext) {
    selectNext(vals.row_id);
    save();
  }
};

const updateInterface = () => {
  selectRows();
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: selected_rows,
  });
};

export const save = () => {
  if (rows.length < 10) {
    throw new Error();
    return;
  }
  axios.post(`/api/vocabulary_maker`, {
    data: {
      rows: rows,
      sound: sound,
    },
  });
};

let missing_sound = [];
let current_word_recording = 0;
const setupSound = () => {
  missing_sound = [];
  current_word_recording = 0;
  Object.keys(raw_sentences).forEach((word) => {
    const lowercase = GetLowercaseStringForAudioKey(word);
    if (!sound.some((i) => GetLowercaseStringForAudioKey(i.recording_of) === lowercase)) {
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
        Object.keys(raw_sentences).length) *
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
  });
  save();
};

export const findMissingDependencies = () => {
  let missing = [];
  Object.keys(dependencies).forEach((from_term) => {
    dependencies[from_term].forEach((to_term) => {
      if (!(to_term in terms) && !(to_term in alternative_ids)) {
        missing.push(to_term);
      }
    });
  });
  missing = _.uniq(missing);
  console.log("Missing:\n" + missing.join("\n"));
};

export const addRowsIfMissing = (text) => {
  text.split(/\n/g).forEach((row) => {
    if (!(getHash(row) in terms) && !(getHash(row) in alternative_ids)) {
      rows.push({
        row_id: maxID++ + 1,
        icelandic: row.trim(),
        level: window.level || null,
      });
      console.log("added " + row);
    }
  });
};

if (isBrowser) {
  window.addRowsIfMissing = addRowsIfMissing;
  window.save = save;
}
