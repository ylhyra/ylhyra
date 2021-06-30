import { isBrowser } from "app/App/functions/isBrowser";
import {
  getHash,
  getHashesFromCommaSeperated,
  getRawTextFromVocabularyEntry,
} from "app/VocabularyMaker/functions";
import store from "app/App/store";
import axios from "app/App/axios";

let maxID = 0;

export const load = async () => {
  let { data } = await axios.get(`/api/vocabulary_maker`, {});
  data = data
    .filter((d) => d.icelandic)
    // .map((i) => ({ ...i, level: parseFloat(i.level) }))
    .sort((a, b) => (a.level || 100) - (b.level || 100));
  data.forEach((i) => {
    maxID = Math.max(maxID, i.row_id);
  });
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: data,
  });
  parse(data);
};

export const select = (id) => {
  store.dispatch({
    type: "VOCABULARY_MAKER_SELECT",
    content: id,
  });
};

export const submit = (vals) => {
  let d = store.getState().vocabularyMaker.data;
  d[d.findIndex((j) => j.row_id === vals.row_id)] = {
    ...vals,
    last_seen: new Date().toISOString().substring(0, 10),
  };
  store.dispatch({
    type: "LOAD_VOCABULARY_MAKER_DATA",
    content: d,
  });
  select(null);
  save(d);
};

export const save = (d) => {
  const j = d || store.getState().vocabularyMaker.data;
  if (j.length < 10) {
    throw new Error();
    return;
  }
  axios.post(`/api/vocabulary_maker`, {
    data: j,
  });
};

if (isBrowser) {
  window.save = save;
}

export const parse = (rows) => {
  let terms = {};
  // let cards = {};
  let dependencies = {};
  let alternative_ids = {};
  let raw_sentences = {};

  const TermsToCardId = (_terms, id) => {
    _terms.forEach((term) => {
      if (!terms[term]) {
        terms[term] = {
          level: null,
          cards: [],
        };
      }
      terms[term].cards.push(id);
    });
  };
  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = dependencies;
    if (type === "alt_ids") {
      obj = alternative_ids;
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
      terms[t] = true;
    });
    icelandic_strings.forEach((t) => {
      raw_sentences[t] = true;
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
  console.log(terms);
};
