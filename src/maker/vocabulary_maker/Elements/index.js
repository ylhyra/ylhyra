import { connect } from "react-redux";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  addEmpty,
  Database,
  delete_row,
  ignore_for_now,
  select,
  selectNext,
  submit,
} from "maker/vocabulary_maker/actions/actions";
import { getDeckName } from "maker/vocabulary_maker/compile/functions";
import { formatVocabularyEntry } from "maker/vocabulary_maker/compile/format";
import {
  didYouMeanSuggestions,
  search,
} from "maker/vocabulary_maker/actions/search";
import { row_titles } from "maker/vocabulary_maker/compile/rowTitles";
import { load } from "maker/vocabulary_maker/actions/initialize";
import VocabularyMakerForm from "maker/vocabulary_maker/Elements/Form";

class VocabularyMaker extends React.Component {
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
        <input
          placeholder="Search..."
          type="text"
          name="search"
          onKeyUp={search}
        />
        <button onClick={addEmpty}>Add</button>
        {this.props.vocabularyMaker.data.map((row) => {
          if (row.row_id === this.props.vocabularyMaker.selected) {
            return <VocabularyMakerForm />;
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
                  {row_titles.map((row_name) =>
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
export default connect((state) => ({
  vocabulary: state.vocabulary,
  vocabularyMaker: state.vocabularyMaker,
}))(VocabularyMaker);
