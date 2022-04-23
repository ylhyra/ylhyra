import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import {
  addEmpty,
  changeMode,
  Database,
  select,
} from "ylhyra/vocabulary/vocabularyEditor/actions/actions";
import { load } from "ylhyra/vocabulary/vocabularyEditor/actions/initialize";
import { search } from "ylhyra/vocabulary/vocabularyEditor/actions/search";
import { formatVocabularyEntry } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format";
import { vocabularyRowTitles } from "ylhyra/vocabulary/vocabularyEditor/rowTitles";
import VocabularyMakerForm from "ylhyra/vocabulary/vocabularyEditor/Elements/Form";

class VocabularyMaker extends React.Component<
  ConnectedProps<typeof connector>
> {
  componentDidMount = async () => {
    load();
  };
  render() {
    if (!this.props.vocabularyMaker.data) return null;
    return (
      <div className="vocabulary_maker">
        <div>
          {Database.rows.filter((r) => !r.last_seen && !r["eyða"]).length} new
          remaining.{" "}
          {
            Database.rows.filter((r) => r.last_seen && !r["eyða"] && !r.english)
              .length
          }{" "}
          old need translation.
        </div>
        <div>
          Mode:
          <select
            name="mode"
            onChange={changeMode}
            defaultValue={Database.mode}
          >
            <option value="">-</option>
            <option
              value="review_importance"
              // selected={Database.mode === "review_importance"}
            >
              Review importance
            </option>
          </select>
        </div>
        <input
          placeholder="Search..."
          type="text"
          name="search"
          onKeyUp={search}
        />
        <button onClick={addEmpty}>Add</button>
        {this.props.vocabularyMaker.data.map((row) => {
          if (row.row_id === this.props.vocabularyMaker.selected) {
            return <VocabularyMakerForm row={row} key={row.row_id} />;
          } else {
            return (
              <div
                key={row.row_id}
                className={`row ${row.last_seen ? "seen" : ""}`}
                onClick={() => select(row.row_id)}
              >
                <b
                  dangerouslySetInnerHTML={{
                    __html: formatVocabularyEntry(row.icelandic),
                  }}
                />{" "}
                ={" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatVocabularyEntry(row.english),
                  }}
                />
                <div className="small gray">
                  {vocabularyRowTitles.slice(2).map((row_name) =>
                    row[row_name] ? (
                      <span key={row_name}>
                        <b>{row_name}</b>:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formatVocabularyEntry(row[row_name]),
                          }}
                        />
                        ,{" "}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  vocabulary: state.vocabulary,
  vocabularyMaker: state.vocabularyMaker,
}));
export default connector(VocabularyMaker);