import { getHash } from "app/VocabularyMaker/functions";
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
  axios.post(`/api/vocabulary_maker`, {
    data: d || store.getState().vocabularyMaker.data,
  });
};

window.save = save;
