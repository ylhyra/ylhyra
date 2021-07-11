import { isBrowser } from "app/App/functions/isBrowser";
import {
  getHash,
  getHashesFromCommaSeperated,
  getPlaintextFromVocabularyEntry,
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
let plaintext_sentences = {};

export const MAX_PER_PAGE = 20;

export const load = async () => {
  window.skip_hash = true;
  let vocabulary = (await axios.get(`/api/vocabulary_maker`, {})).data;
  sound = (vocabulary && vocabulary.sound) || [];
  rows = (vocabulary && vocabulary.rows) || [];
  rows.forEach((row, index) => {
    maxID = Math.max(maxID, row.row_id);
    // row.row_id = index;
    // return row;
  });

  // const parsed = parse(vocabulary)
  // terms = parsed.terms
  // dependencies = parsed.dependencies
  // alternative_ids = parsed.alternative_ids
  // plaintext_sentences = parsed.plaintext_sentences
  ({ terms, dependencies, alternative_ids, plaintext_sentences } =
    parse_vocabulary_file(vocabulary, true));
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
        // (b.level <= 3) - (a.level <= 3) ||
        Boolean(a.last_seen) - Boolean(b.last_seen) ||
        b.row_id - a.row_id ||
        Boolean(a.icelandic) - Boolean(b.icelandic) ||
        Boolean(a.english) - Boolean(b.english) ||
        (a.level || 100) - (b.level || 100) ||
        Boolean(a["Laga?"]) - Boolean(b["Laga?"]) ||
        Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
        false
    );
  selectRows();
  select(selected_rows.length > 0 && selected_rows[0].row_id);
};

export const selectRows = (noupdate) => {
  if (!isSearching) {
    selected_rows = rows
      .filter((i) => i.level <= 3 || !i.level)
      .slice(0, MAX_PER_PAGE);
  } else if (!noupdate) {
    selected_rows = selected_rows
      .map((s) => rows.find((j) => j.row_id === s.row_id))
      .filter(Boolean);
  }
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: selected_rows,
  });
};

export const select = (id) => {
  id &&
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
  if (rows.length < 1) {
    throw new Error("No rows");
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
  Object.keys(plaintext_sentences).forEach((word) => {
    const lowercase = GetLowercaseStringForAudioKey(word);
    if (
      !sound.some(
        (i) => GetLowercaseStringForAudioKey(i.recording_of) === lowercase
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

export const addEmpty = () => {
  rows.push({
    row_id: maxID++ + 1,
  });
  refreshRows();
};

export const addRowsIfMissing = (text) => {
  text.split(/\n/g).forEach((row) => {
    if (!row || !row.trim()) return;
    const [is, en, level, depends_on, lemmas] = row.split(/(?: = |\t)/g);
    if (
      !(getHash(is) in terms) &&
      !(getHash(is) in alternative_ids) &&
      !rows.some((j) => j.icelandic === is)
    ) {
      rows.push({
        row_id: maxID++ + 1,
        icelandic: is.trim(),
        english: en && en.trim(),
        level: level || window.term_level || 1,
        depends_on: depends_on || "",
        lemmas: lemmas || "",
      });
      console.log("added " + is);
    }
  });
  // console.log(rows);
  save();
  refreshRows();
};

let isSearching = false;
export const search = (e) => {
  if (e.keyCode !== 13 /* Enter */) return;
  const text = e.target.value.trim();
  if (!text) {
    isSearching = false;
  } else {
    isSearching = true;
    selected_rows = rows
      .filter((j) =>
        new RegExp(text, "i").test(
          [
            getPlaintextFromVocabularyEntry(j.icelandic),
            j.lemmas,
            j.depends_on,
            j.note,
            j.alternative_ids,
            j.note_regarding_english,
            j.related_items,
            j["this is a minor variation of"],
          ].join(" ")
        )
      )
      .sort((a, b) => a.icelandic.length - b.icelandic.length);
  }
  selectRows(true);
};

if (isBrowser) {
  window.addRowsIfMissing = addRowsIfMissing;
  window.save = save;
  window.rows = () => rows;
}
