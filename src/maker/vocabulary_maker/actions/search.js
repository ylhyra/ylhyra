import {
  formatVocabularyEntry,
  getPlaintextFromVocabularyEntry,
} from "maker/vocabulary_maker/compile/format";
import {
  delete_row,
  rows,
  select,
  selected_rows,
  selectRows,
} from "maker/vocabulary_maker/actions/actions";

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
