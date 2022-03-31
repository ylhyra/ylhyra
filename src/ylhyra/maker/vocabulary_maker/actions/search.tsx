import {
  Database,
  select,
  selectRows,
} from "ylhyra/maker/vocabulary_maker/actions/actions";
import { getPlaintextFromVocabularyEntry } from "ylhyra/maker/vocabulary_maker/compile/format";
import React from "react";

export let isSearching = false;
export let reDoSearch;
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
    Database.selected_rows = Database.rows
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

export const turnOffSearch = () => {
  isSearching = false;
};
