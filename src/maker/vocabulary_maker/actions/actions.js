import { isBrowser } from "app/app/functions/isBrowser";
import { getDeckName, getHash } from "maker/vocabulary_maker/compile/functions";
import store from "app/app/store";
import axios from "app/app/axios";
import _ from "underscore";
import { parse_vocabulary_file } from "maker/vocabulary_maker/compile/parse_vocabulary_file";
import { isSearching, reDoSearch } from "maker/vocabulary_maker/actions/search";
import { setupSound } from "maker/vocabulary_maker/actions/sound";

export let maxID = 0;
export let rows = [];
export let sound = [];
export let terms = {};
export let cards = {};
export let dependencies = {};
export let alternative_ids = {};
export let plaintext_sentences = {};

export const MAX_PER_PAGE = 20;

export const load = async () => {
  // window.skip_hash = true;
  console.log(getDeckName());
  let vocabulary = (
    await axios.post(`/api/vocabulary_maker/get`, {
      deckName: getDeckName(),
    })
  ).data;
  sound = vocabulary?.sound || [];
  rows = vocabulary?.rows || [];

  // rows = rows.map((row, index) => {
  //   row.row_id = index + 1;
  //   return row;
  // });
  rows.forEach((row) => {
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

export let selected_rows = [];
export const refreshRows = () => {
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
    deckName: getDeckName(),
  });
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
    if (getDeckName()) {
      is = is?.replace(/;+/g, ";;").replace(/,/g, ";");
      en = en?.replace(/;+/g, ";;").replace(/,/g, ";");
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

if (isBrowser) {
  window.addRowsIfMissing = addRowsIfMissing;
  window.save = save;
  window.rows = () => rows;
}
