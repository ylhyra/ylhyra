import React from "react";
import {
  formatVocabularyEntry,
  getPlaintextFromVocabularyEntry,
} from "maker/vocabulary_maker/compile/format";
import {
  delete_row,
  Database,
  select,
  selectRows,
} from "maker/vocabulary_maker/actions/actions";
import _ from "underscore";

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

export const didYouMeanSuggestions = (is, input_row_id) => {
  const split = is.toLowerCase().split(/[ ;,]/g);
  const v = Database.rows
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

  const dependsOnThis = Database.rows
    .map((r) => {
      if (r.icelandic === is) return null;
      const v = r.icelandic.toLowerCase().split(/[ ;,]/g);
      if (_.intersection(v, split).length > 0) {
        return {
          ...r,
          score: r.level,
        };
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);

  if (dependsOnThis.length === 0) {
    if (v.length === 0) return null;
    if (v[0].score === v[5]?.score) return null;
  }

  const u = v.slice(0, 1).map((j, i) => (
    <div
      key={i}
      style={{ cursor: "pointer" }}
      onClick={() => {
        // i.row_id
        const x = Database.rows.findIndex((f) => f.row_id === j.row_id);
        const vals = Database.rows[x];
        Database.rows[x] = {
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
