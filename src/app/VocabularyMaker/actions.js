import { isBrowser } from "app/App/functions/isBrowser";
import {
  getHash,
  getHashesFromCommaSeperated,
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
  let cards = {};
  let dependencies = {};
  let alternative_ids = {};

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
    const icelandic = clean_string(columns.icelandic);
    if (!icelandic) return;
    if (columns.should_teach === "no") return;

    /* Can have multiple */
    let icelandic_strings = [];
    icelandic.split(/(.+?[^\\])([,;])/g).forEach((i) => {
      i = i.trim();
      if (!i) return;
      if (i === "," || i === ";") return;
      i = clean_string(i);
      icelandic_strings.push(i);
    });
    const terms_in_this_line = icelandic_strings.map(getHash);
    const _alternative_ids = getHashesFromCommaSeperated(
      columns.alternative_id
    );
    const depends_on = [
      ...getHashesFromCommaSeperated(columns.depends_on),
      ...getHashesFromCommaSeperated(columns.basic_form),
      ...getHashesFromCommaSeperated(columns["this is a minor variation of"]),
    ];

    AddToDependencyGraph(terms_in_this_line, depends_on);
    AddToDependencyGraph(_alternative_ids, terms_in_this_line, "alt_ids");

    if (
      columns.direction &&
      columns.direction !== "<-" &&
      columns.direction !== "->"
    ) {
      throw new Error(`Unknown direction ${columns.direction}`);
    }

    /* Icelandic to English */
    if (columns.direction !== "<-") {
      icelandic_strings.forEach((i) => {
        to_add.push({
          is: i,
          from: "is",
          id: getHash(i) + "_is",
          ...card_skeleton,
        });
      });
    }

    /* English to Icelandic */
    if (columns.direction !== "->") {
      to_add.push({
        is: clean_string(icelandic),
        from: "en",
        id: getHash(icelandic) + "_en",
        ...card_skeleton,
      });
    }

    to_add.forEach(({ id, ...card }) => {
      if (cards[id]) return console.log(`"${icelandic}" already exists`);
      // [...terms_in_this_line, ...alternative_ids].forEach(j => {
      //   termsToCardIds[j] = [
      //     ...(termsToCardIds[j] || []),
      //     card.id
      //   ]
      // })
      // termDependsOnTerms[card.id] = terms_in_this_line
      TermsToCardId(terms_in_this_line, id);
      cards[id] = {
        id,
        ...card,
      };
    });
  });
};
