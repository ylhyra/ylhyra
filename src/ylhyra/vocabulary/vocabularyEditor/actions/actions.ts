import { isBrowser } from "modules/isBrowser";
import { log } from "modules/log";
import _ from "underscore";
import axios from "ylhyra/app/app/axios";
import store from "ylhyra/app/app/store";
import {
  getDeckName,
  getHashForVocabulary,
} from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { VocabularyFile } from "ylhyra/vocabulary/types";
import {
  isSearching,
  reDoSearch,
  turnOffSearch,
} from "ylhyra/vocabulary/vocabularyEditor/actions/search";
import { vocabularyRowStructureAsObject } from "ylhyra/vocabulary/vocabularyEditor/rowTitles";

export const Database: {
  mode: null;
  maxID: number;
  cards: {};
  terms: {};
  plaintext_sentences: {};
  sound: VocabularyFile["sound"];
  rows: VocabularyFile["rows"];
  selected_rows: VocabularyFile["rows"];
  alternativeIds: {};
  dependencies: {};
} = {
  maxID: 0,
  rows: [],
  sound: [],
  terms: {},
  cards: {},
  dependencies: {},
  alternativeIds: {},
  plaintext_sentences: {},
  selected_rows: [],
  mode: null,
  // mode: "review_importance",
};

export const MAX_PER_PAGE = 20;

export const refreshRows = () => {
  if (Database.mode === "review_importance") {
    Database.rows = Database.rows.sort(
      (a, b) =>
        booleanCompare(a["eyða"], b["eyða"]) ||
        booleanCompare(b.english, a.english) ||
        booleanCompare(b.icelandic, a.icelandic) ||
        booleanCompare("difficulty" in a, "difficulty" in b) ||
        // a.last_seen?.localeCompare(b.last_seen) ||
        booleanCompare(a.fix, b.fix) ||
        booleanCompare(b.level <= 3, a.level <= 3) ||
        b.level - a.level
      // ||
      // false
    );
  } else {
    Database.rows = Database.rows.sort(
      (a, b) =>
        booleanCompare(a["eyða"], b["eyða"]) ||
        // Boolean(a.userLevel) - Boolean(b.userLevel) ||
        booleanCompare(a.icelandic, b.icelandic) ||
        booleanCompare(a.last_seen, b.last_seen) ||
        booleanCompare(a.english, b.english) ||
        a.last_seen?.localeCompare(b.last_seen) ||
        booleanCompare(b.level <= 3, a.level <= 3) ||
        (a.level || 100) - (b.level || 100) ||
        a.row_id - b.row_id ||
        booleanCompare(a.fix, b.fix)
      // ||
      // false
    );
  }
  selectRows();
  select(Database.selected_rows.length > 0 && Database.selected_rows[0].row_id);
};

export function selectRows(noupdate?) {
  if (!isSearching) {
    Database.selected_rows = Database.rows
      // .filter((i) => i.row_id > 1600 || i.userLevel <= 3 || !i.userLevel)
      // .filter((r) => !r.last_seen && !r["eyða"])
      .slice(0, MAX_PER_PAGE);
  } else if (!noupdate) {
    Database.selected_rows = [
      ...Database.rows.filter((j) => !j.icelandic),
      ...Database.selected_rows
        .map((s) => Database.rows.find((j) => j.row_id === s.row_id))
        .filter(Boolean),
    ];
  }
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: Database.selected_rows,
  });
}

export function select(id) {
  if (id) {
    store.dispatch({
      type: "VOCABULARY_MAKER_SELECT",
      content: id,
    });
    setTimeout(() => {
      if (!document.querySelector("form")) return;
      window.scroll(
        0,
        document.querySelector("form").offsetTop +
          (document.querySelector("#content") as HTMLElement).offsetTop
      );
    }, 120);
  } else {
    store.dispatch({
      type: "VOCABULARY_MAKER_SELECT",
      content: null,
    });
  }
}

export function selectNext(row_id) {
  const x =
    Database.selected_rows[
      Database.selected_rows.findIndex((j) => j.row_id === row_id) + 1
    ];
  if (x?.row_id) {
    select(x.row_id);
  } else {
    turnOffSearch();
    refreshRows();
  }
}

export const delete_row = (row_id) => {
  selectNext(row_id);
  Database.rows.splice(
    Database.rows.findIndex((j) => j.row_id === row_id),
    1
  );
  updateInterface();
  save();
  // ignore_for_now(row_id, "DELETED");
};

export const ignore_for_now = (row_id, message?) => {
  const v = Database.rows.findIndex((j) => j.row_id === row_id);
  Database.rows[v] = {
    ...Database.rows[v],
    eyða: message || "IGNORED",
  };
  selectNext(row_id);
  save();
};

export function submit(vals, gotonext = true) {
  vals = formatVocabularyData(vals);
  Database.rows[Database.rows.findIndex((j) => j.row_id === vals.row_id)] = {
    ...vals,
    last_seen: new Date().toISOString().substring(0, 10),
  };
  updateInterface();
  // select(null);
  if (gotonext) {
    selectNext(vals.row_id);
    save();
  }
}

export function formatVocabularyData(vals) {
  Object.keys(vocabularyRowStructureAsObject).forEach((row_name) => {
    if (vocabularyRowStructureAsObject[row_name].isNumber && vals[row_name]) {
      vals[row_name] = parseInt(vals[row_name]);
    }
  });
  return vals;
}

const updateInterface = () => {
  selectRows();
  // store.dispatch({
  //   type: "LOAD_VOCABULARY_MAKER_DATA",
  //   content: selected_rows,
  // });
};

export const save = async () => {
  if (Database.rows.length < 1) {
    throw new Error("No rows");
  }
  await axios.post(`/api/vocabulary_maker`, {
    data: {
      rows: Database.rows,
      sound: Database.sound,
    },
    deckName: getDeckName(),
  });
  log("Saved");
};

export const findMissingDependencies = () => {
  let missing = [];
  Object.keys(Database.dependencies).forEach((from_term) => {
    Database.dependencies[from_term].forEach((to_term) => {
      if (
        !(to_term in Database.terms) &&
        !(to_term in Database.alternativeIds)
      ) {
        missing.push(to_term);
      }
    });
  });
  missing = _.uniq(missing);
  console.log("Missing " + missing.length + " dependencies");
  // console.log({ missing: missing /*.join("\n")*/ });
  console.log({ missingDependencies: missing.join("\n") });
};

export const addEmpty = () => {
  Database.rows.push({
    row_id: Database.maxID++ + 1,
    icelandic: (document.querySelector("[name=search]") as HTMLInputElement)
      .value,
  });
  refreshRows();
  isSearching && reDoSearch?.();
};

export function addRowsIfMissing(text) {
  let seen = [];
  let prompt_level = !getDeckName() ? window.prompt("Level:") : null;
  text.split(/\n/g).forEach((row) => {
    if (!row || !row.trim()) return;
    let [is, en, note /*level, depends_on, lemmas*/] = row
      .replace(/^- /, "")
      .split(/(?: = |\t)/g);
    if (getDeckName()) {
      is = is?.replace(/;+/g, ";;").replace(/,/g, ";");
      en = en?.replace(/;+/g, ";;").replace(/,/g, ";");
    }
    if (
      !(getHashForVocabulary(is) in Database.terms) &&
      !(getHashForVocabulary(is) in Database.alternativeIds) &&
      !Database.rows.some((j) => j.icelandic === is) &&
      !seen.includes(getHashForVocabulary(is))
    ) {
      Database.rows.push({
        row_id: Database.maxID++ + 1,
        icelandic: is.trim(),
        english: en?.trim(),
        alternative_id: is.trim(),
        // // level: DECK ? null : level || window.term_level || 1,
        // level: level || prompt_level || null,
        // depends_on: depends_on || "",
        // lemmas: lemmas || "",
        note: note || "",
      });
      console.log("added " + is);
      seen.push(getHashForVocabulary(is));
    }
  });
  // console.log(rows);
  save();
  refreshRows();
}

if (isBrowser) {
  window["addRowsIfMissing"] = addRowsIfMissing;
  window["a"] = addRowsIfMissing;
  window["save"] = save;
  // window.rows = () => rows;
}

export function changeMode(e) {
  const value = e.target.value;
  Database.mode = value;
  refreshRows();
  // if (value === "review_importance") {
  // }
}

const booleanCompare = (a: any, b: any) => (a ? 1 : 0) - (b ? 1 : 0);
