import { formatVocabularyEntry, row_titles } from "./functions";
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
import { deck } from "app/Vocabulary/actions/deck";
import { withDependencies } from "app/Vocabulary/actions/functions/withDependencies";
import { DECK } from "./functions";

let maxID = 0;
export let rows = [];
let sound = [];
let terms = {};
let cards = {};
let dependencies = {};
let alternative_ids = {};
let plaintext_sentences = {};

export const MAX_PER_PAGE = 20;

export const load = async () => {
  // window.skip_hash = true;
  let vocabulary = (await axios.get(`/api/vocabulary_maker`, {})).data;
  sound = vocabulary?.sound || [];
  rows = vocabulary?.rows || [];

  // rows = rows.map((row, index) => {
  //   row.row_id = index + 1;
  //   return row;
  // });
  rows.forEach((row, index) => {
    maxID = Math.max(maxID, row.row_id);
    // row.row_id = index;
    // return row;
  });
  console.log({ maxID });
  // const parsed = parse(vocabulary)
  // terms = parsed.terms
  // dependencies = parsed.dependencies
  // alternative_ids = parsed.alternative_ids
  // plaintext_sentences = parsed.plaintext_sentences
  ({ terms, cards, dependencies, alternative_ids, plaintext_sentences } =
    parse_vocabulary_file(vocabulary, true));
  setTimeout(() => {
    setupSound();
  }, 1000);

  findMissingDependencies();
  refreshRows();
};

let selected_rows = [];
export const refreshRows = (id) => {
  rows =
    // _.shuffle(rows)
    rows.sort(
      (a, b) =>
        Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
        Boolean(a.icelandic) - Boolean(b.icelandic) ||
        Boolean(a.last_seen) - Boolean(b.last_seen) ||
        // a.last_seen?.localeCompare(b.last_seen) ||
        b.row_id - a.row_id ||
        (b.level <= 3) - (a.level <= 3) ||
        Boolean(a.english) - Boolean(b.english) ||
        (a.level || 100) - (b.level || 100) ||
        Boolean(a["fix"]) - Boolean(b["fix"]) ||
        false
    );
  selectRows();
  select(selected_rows.length > 0 && selected_rows[0].row_id);
};

export const selectRows = (noupdate) => {
  if (!isSearching) {
    selected_rows = rows
      // .filter((i) => i.row_id > 1600 || i.level <= 3 || !i.level)
      // .filter((r) => !r.last_seen && !r["eyða"])
      .slice(0, MAX_PER_PAGE);
  } else if (!noupdate) {
    selected_rows = [
      ...rows.filter((j) => !j.icelandic),
      ...selected_rows
        .map((s) => rows.find((j) => j.row_id === s.row_id))
        .filter(Boolean),
    ];
  }
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: selected_rows,
  });
};

export const select = (id) => {
  if (id) {
    store.dispatch({
      type: "VOCABULARY_MAKER_SELECT",
      content: id,
    });
  } else {
    store.dispatch({
      type: "VOCABULARY_MAKER_SELECT",
      content: null,
    });
  }
};

export const selectNext = (row_id) => {
  const x =
    selected_rows[selected_rows.findIndex((j) => j.row_id === row_id) + 1];
  if (x?.row_id) {
    select(x.row_id);
  } else {
    isSearching = false;
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
  save();
  // ignore_for_now(row_id, "DELETED");
};

export const ignore_for_now = (row_id, message) => {
  const v = rows.findIndex((j) => j.row_id === row_id);
  rows[v] = {
    ...rows[v],
    eyða: message || "IGNORED",
  };
  selectNext(row_id);
  save();
};

export const submit = (vals, gotonext = true) => {
  // console.log(vals);
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
  // store.dispatch({
  //   type: "LOAD_VOCABULARY_MAKER_DATA",
  //   content: selected_rows,
  // });
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
  console.log(sentences);
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
  console.log("Missing " + missing.length + " terms");
  // console.log({ missing: missing /*.join("\n")*/ });
  console.log({ missing: missing.join("\n") });
};

export const addEmpty = () => {
  rows.push({
    row_id: maxID++ + 1,
    icelandic: document.querySelector("[name=search]").value,
  });
  refreshRows();
  isSearching && reDoSearch?.();
};

export const addRowsIfMissing = (text) => {
  let seen = [];
  let prompt_level = window.prompt("Level:");
  text.split(/\n/g).forEach((row) => {
    if (!row || !row.trim()) return;
    let [is, en, level, depends_on, lemmas] = row
      .replace(/^- /, "")
      .split(/(?: = |\t)/g);
    if (DECK) {
      is = is?.replace(/;/g, ";;").replace(/,/g, ";");
      en = en?.replace(/;/g, ";;").replace(/,/g, ";");
    }
    if (
      !(getHash(is) in terms) &&
      !(getHash(is) in alternative_ids) &&
      !rows.some((j) => j.icelandic === is) &&
      !seen.includes(getHash(is))
    ) {
      rows.push({
        row_id: maxID++ + 1,
        icelandic: is.trim(),
        english: en?.trim(),
        alternative_id: is.trim(),
        // level: DECK ? null : level || window.term_level || 1,
        level: level || prompt_level || null,
        depends_on: depends_on || "",
        lemmas: lemmas || "",
      });
      console.log("added " + is);
      seen.push(getHash(is));
    }
  });
  // console.log(rows);
  save();
  refreshRows();
};

let isSearching = false;
let reDoSearch;
export const search = (e) => {
  select(null);
  reDoSearch = () => {
    search(e);
  };
  // if (e.keyCode !== 13 /* Enter */) return;
  const text = e.target.value.trim();
  if (!text) {
    isSearching = false;
  } else {
    isSearching = true;
    selected_rows = rows
      .filter(
        (j) =>
          !j.icelandic ||
          new RegExp(text, "i").test(
            [
              getPlaintextFromVocabularyEntry(j.icelandic),
              getPlaintextFromVocabularyEntry(j.english),
              j.lemmas,
              j.depends_on,
              j.note,
              j.alternative_id,
              j.note_regarding_english,
              j.related_items,
              j["this is a minor variation of"],
            ].join(" ")
          )
      )
      .sort((a, b) => a.icelandic?.length - b.icelandic?.length);
  }
  selectRows(true);
};

if (isBrowser) {
  window.addRowsIfMissing = addRowsIfMissing;
  window.save = save;
  window.rows = () => rows;
}

export const didYouMeanSuggestions = (is, input_row_id) => {
  const split = is.toLowerCase().split(/[ ;,]/g);
  const v = rows
    .map((r) => {
      if (r.icelandic === is) return null;
      const v = ">" + r.icelandic.toLowerCase().split(/[ ;,]/g).join(">") + ">";
      let score = 0;
      for (let i = 0; i < split.length; i++) {
        for (let b = i + 1; b <= split.length; b++) {
          const fragment = ">" + split.slice(i, b).join(">") + ">";
          if (fragment.length < 6) continue;
          if (v.includes(fragment)) {
            score += (b - i) * 2 + fragment.length;
          }
        }
      }
      return {
        ...r,
        score,
      };
    })
    .filter((j) => j?.score > 10)
    .sort((a, b) => b.score - a.score);

  if (v.length === 0) return null;
  if (v[0].score === v[5]?.score) return null;

  const u = v.slice(0, 1).map((j, i) => (
    <div
      key={i}
      onClick={() => {
        // i.row_id
        const x = rows.findIndex((f) => f.row_id === j.row_id);
        const vals = rows[x];
        rows[x] = {
          ...vals,
          alternative_id: vals.alternative_id + ", " + is,
        };

        delete_row(input_row_id);
        // select(j.row_id);
      }}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: formatVocabularyEntry(j.icelandic),
        }}
      />
    </div>
  ));
  return <div className="small gray">Did you mean: {u}</div>;
};
