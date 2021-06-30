import { isBrowser } from "app/App/functions/isBrowser";
import {
  getHash,
  getHashesFromCommaSeperated,
  getRawTextFromVocabularyEntry,
  simplify_string,
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

export const load = async () => {
  let vocabulary = (await axios.get(`/api/vocabulary_maker`, {})).data;
  rows = _.shuffle(vocabulary.rows)
    // .filter((d) => d.icelandic)
    // .map((i) => ({ ...i, level: parseFloat(i.level) }))
    .sort((a, b) => (a.level || 100) - (b.level || 100));
  rows.forEach((i) => {
    maxID = Math.max(maxID, i.row_id);
  });
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: rows,
  });
  parse();
};

export const select = (id) => {
  store.dispatch({
    type: "VOCABULARY_MAKER_SELECT",
    content: id,
  });
};

export const submit = (vals) => {
  rows[rows.findIndex((j) => j.row_id === vals.row_id)] = {
    ...vals,
    last_seen: new Date().toISOString().substring(0, 10),
  };
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: rows,
  });
  select(null);
  save();
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

if (isBrowser) {
  window.save = save;
}

export const parse = () => {
  let _terms = {};
  let _dependencies = {};
  let _alternative_ids = {};
  let _raw_sentences = [];

  const TermsToCardId = (_terms, id) => {
    _terms.forEach((term) => {
      if (!_terms[term]) {
        _terms[term] = {
          level: null,
          cards: [],
        };
      }
      _terms[term].cards.push(id);
    });
  };
  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = _dependencies;
    if (type === "alt_ids") {
      obj = _alternative_ids;
    }
    first.forEach((id) => {
      obj[id] = [...(obj[id] || []), ...second];
    });
  };

  rows.forEach((row) => {
    if (!row.icelandic) return;

    /* Can have multiple */
    let icelandic_strings = row.icelandic
      .split(/;+/g)
      .map(getRawTextFromVocabularyEntry);
    const terms_in_this_line = icelandic_strings.map(getHash);
    const _alternative_ids = getHashesFromCommaSeperated(row.alternative_id);
    const depends_on = [
      ...getHashesFromCommaSeperated(row.depends_on),
      ...getHashesFromCommaSeperated(row.basic_form),
      ...getHashesFromCommaSeperated(row["this is a minor variation of"]),
    ];

    AddToDependencyGraph(terms_in_this_line, depends_on);
    AddToDependencyGraph(_alternative_ids, terms_in_this_line, "alt_ids");

    if (row.direction && row.direction !== "<-" && row.direction !== "->") {
      throw new Error(`Unknown direction ${row.direction}`);
    }

    terms_in_this_line.forEach((t) => {
      _terms[t] = true;
    });
    icelandic_strings.forEach((t) => {
      _raw_sentences[t] = true;
    });

    // /* Icelandic to English */
    // if (row.direction !== "<-") {
    //   icelandic_strings.forEach((i) => {
    //     to_add.push({
    //       is: i,
    //       from: "is",
    //       id: getHash(i) + "_is",
    //       ...card_skeleton,
    //     });
    //   });
    // }
    //
    // /* English to Icelandic */
    // if (row.direction !== "->") {
    //   to_add.push({
    //     is: clean_string(icelandic),
    //     from: "en",
    //     id: getHash(icelandic) + "_en",
    //     ...card_skeleton,
    //   });
    // }
  });
  // console.log(_terms);
  terms = _terms;
  dependencies = _dependencies;
  alternative_ids = _alternative_ids;
  raw_sentences = _raw_sentences;

  setupSound();
};

let missing_sound = [];
let current_word_recording = 0;
const setupSound = () => {
  missing_sound = [];
  Object.keys(raw_sentences).forEach((word) => {
    const lowercase = simplify_string(word);
    // todo
    missing_sound.push(word);
  });
  nextWordRecord();
};

export const nextWordRecord = () => {
  const remaining = `${current_word_recording}/${missing_sound.length}`;
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
  sound.push({
    word,
    filename,
    speed: window.recording_metadata.speed,
    speaker: window.recording_metadata.speaker,
  });
  save();
};
