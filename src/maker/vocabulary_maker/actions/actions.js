import { isBrowser } from "app/app/functions/isBrowser";
import { getDeckName, getHash } from "maker/vocabulary_maker/compile/functions";
import store from "app/app/store";
import axios from "app/app/axios";
import _ from "underscore";
import { parse_vocabulary_file } from "maker/vocabulary_maker/compile/parse_vocabulary_file";
import {
  isSearching,
  reDoSearch,
  turnOffSearch,
} from "maker/vocabulary_maker/actions/search";
import { setupSound } from "maker/vocabulary_maker/actions/sound";
import { log } from "app/app/functions/log";

export const Database = {
  maxID: 0,
  rows: [],
  sound: [],
  terms: {},
  cards: {},
  dependencies: {},
  alternative_ids: {},
  plaintext_sentences: {},
  selected_rows: [],
};

export const MAX_PER_PAGE = 20;

export const load = async () => {
  // window.skip_hash = true;
  console.log(getDeckName());
  let vocabulary = (
    await axios.post(`/api/vocabulary_maker/get`, {
      deckName: getDeckName(),
    })
  ).data;
  Database.sound = vocabulary?.sound || [];
  Database.rows = vocabulary?.rows || [];

  Database.rows.forEach((row) => {
    Database.maxID = Math.max(Database.maxID, row.row_id);
  });
  Database.rows = Database.rows.map((row) => {
    if (!row.alternative_id) {
      row.alternative_id = row.icelandic;
    }
    return row;
  });

  Object.assign(Database, parse_vocabulary_file(vocabulary));

  setTimeout(() => {
    setupSound();
  }, 1000);

  findMissingDependencies();
  refreshRows();
};

export const refreshRows = () => {
  Database.rows =
    // _.shuffle(rows)
    Database.rows.sort(
      (a, b) =>
        Boolean(a["eyða"]) - Boolean(b["eyða"]) ||
        // Boolean(a.level) - Boolean(b.level) ||
        Boolean(a.icelandic) - Boolean(b.icelandic) ||
        Boolean(a.last_seen) - Boolean(b.last_seen) ||
        Boolean(a.english) - Boolean(b.english) ||
        a.last_seen?.localeCompare(b.last_seen) ||
        (b.level <= 3) - (a.level <= 3) ||
        (a.level || 100) - (b.level || 100) ||
        a.row_id - b.row_id ||
        Boolean(a.fix) - Boolean(b.fix) ||
        false
    );
  selectRows();
  select(Database.selected_rows.length > 0 && Database.selected_rows[0].row_id);
};

export const selectRows = (noupdate) => {
  if (!isSearching) {
    Database.selected_rows = Database.rows
      // .filter((i) => i.row_id > 1600 || i.level <= 3 || !i.level)
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
    Database.selected_rows[
      Database.selected_rows.findIndex((j) => j.row_id === row_id) + 1
    ];
  if (x?.row_id) {
    select(x.row_id);
  } else {
    turnOffSearch();
    refreshRows();
  }
};

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

export const ignore_for_now = (row_id, message) => {
  const v = Database.rows.findIndex((j) => j.row_id === row_id);
  Database.rows[v] = {
    ...Database.rows[v],
    eyða: message || "IGNORED",
  };
  selectNext(row_id);
  save();
};

export const submit = (vals, gotonext = true) => {
  // console.log(vals);
  vals.level = vals.level ? parseFloat(vals.level) : vals.level;
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
};

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
        !(to_term in Database.alternative_ids)
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
    icelandic: document.querySelector("[name=search]").value,
  });
  refreshRows();
  isSearching && reDoSearch?.();
};

export const addRowsIfMissing = (text) => {
  let seen = [];
  let prompt_level = !getDeckName() ? window.prompt("Level:") : null;
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
      !(getHash(is) in Database.terms) &&
      !(getHash(is) in Database.alternative_ids) &&
      !Database.rows.some((j) => j.icelandic === is) &&
      !seen.includes(getHash(is))
    ) {
      Database.rows.push({
        row_id: Database.maxID++ + 1,
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
