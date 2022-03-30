import { Database, delete_row } from "maker/vocabulary_maker/actions/actions";
import { compareTwoStrings } from "string-similarity";
import _ from "underscore";
import { formatVocabularyEntry } from "maker/vocabulary_maker/compile/format";
import React from "react";

let memoizedSuggestions = {};
export const didYouMeanSuggestions = (is, input_row_id) => {
  if (memoizedSuggestions.row_id === input_row_id) {
    return memoizedSuggestions.value;
  }
  const split = is.toLowerCase().replace(/[.?!]/g, "").split(/[ ;,]/g);
  let similar = Database.rows
    .map((r) => {
      if (r.icelandic === is) return null;
      const word =
        ">" +
        (r.icelandic + ">->" + r.alternative_id + ">->" + r.lemmas)
          .toLowerCase()
          .replace(/[.?!]/g, "")
          .split(/[ ;,]/g)
          .join(">") +
        ">";
      let score = 0;

      for (let i = 0; i < split.length; i++) {
        for (let b = i + 1; b <= split.length; b++) {
          const fragment = ">" + split.slice(i, b).join(">") + ">";

          // if (fragment.length < 3) continue;
          if (word.includes(fragment)) {
            score += (b - i) * 2 + fragment.length;
          } else if (fragment.length > 6) {
            const s = compareTwoStrings(fragment, word);
            if (s > 0.2) {
              score += (b - i) / 2 + s;
            }
          }
          // if (r.icelandic === "Þetta er leiðinlegt.") {
          //   console.log({
          //     fragment,
          //     word,
          //     score,
          //     s: compareTwoStrings(fragment, word),
          //   });
          // }
        }
      }

      return {
        ...r,
        score,
      };
    })
    .filter((j) => j?.score > 0)
    .sort((a, b) => b.score - a.score);

  const sentenceSplit = is.toLowerCase().split(/[;]/g);
  const dependsOnThis = Database.rows
    .map((r) => {
      if (r.icelandic === is) return null;
      const i = `${r.lemmas || ""}; ${r.depends_on || ""}`
        .toLowerCase()
        .replaceAll("%", "")
        .split(/[;,]/g)
        .filter(Boolean)
        .map((i) => i.trim());
      if (_.intersection(i, sentenceSplit).length > 0) {
        return {
          ...r,
          score: r.icelandic.length,
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.level - b.level || a.score - b.score);

  // if (similar[0]?.score === similar[5]?.score) similar = [];
  if (dependsOnThis.length === 0 && similar.length === 0) {
    return null;
  }

  const u = _.uniq(
    [...dependsOnThis.slice(0, 3), ...similar.slice(0, 3)],
    false,
    (row) => row.row_id
  ).map((j, i) => (
    <div
      key={i}
      style={{ cursor: "pointer" }}
      onClick={() => {
        // i.row_id
        const x = Database.rows.findIndex((f) => f.row_id === j.row_id);
        const vals = Database.rows[x];
        Database.rows[x] = {
          ...vals,
          alternative_id: (vals.alternative_id || "") + ", " + is,
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
  const returns = <div className="small gray">Did you mean: {u}</div>;
  memoizedSuggestions = { row_id: input_row_id, value: returns };
  return returns;
};
