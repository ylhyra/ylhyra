import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";
import {
  rows,
  load,
  select,
  submit,
  delete_row,
  selectNext,
  search,
  addEmpty,
  ignore_for_now,
  didYouMeanSuggestions,
} from "./actions";
import { formatVocabularyEntry, row_titles } from "./functions";
import VocabularyMakerRecord from "maker/VocabularyMaker/record";
import AutosizeTextarea from "react-textarea-autosize";
import { getDeckName } from "./functions";

class Form2 extends React.Component {
  componentDidMount = async () => {
    load();
    this.formRef = React.createRef();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  };
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentDidUpdate() {
    if (!this.props.vocabularyMaker.selected) return;
    if (!document.querySelector("form")) return;
    window.scroll(
      0,
      document.querySelector("form").offsetTop +
        document.querySelector("#content").offsetTop
    );
  }
  keyUp = () => {
    // this.isKeyDown = false;
  };
  checkKey = (e) => {
    if (e.altKey && e.metaKey) return;
    const set = (name, val) => {
      let data = {};
      ["icelandic", "english", ...row_titles].forEach((row_title) => {
        data[row_title] =
          document.querySelector(`[name=${row_title}]`)?.value || "";
      });
      submit(
        {
          ...row,
          ...data,
          [name]: val,
        },
        false
      );
    };

    // console.log(e);
    // return;
    if (!this.props.vocabularyMaker.selected) return;
    const rows = this.props.vocabularyMaker.data;
    const row =
      rows[
        rows.findIndex((j) => j.row_id === this.props.vocabularyMaker.selected)
      ];
    let number;
    if (e.keyCode === 49) number = 1;
    if (e.keyCode === 50) number = 2;
    if (e.keyCode === 51) number = 3;
    if (e.keyCode === 52) number = 4;
    if (e.keyCode === 53) number = 5;
    if (e.metaKey && e.keyCode === 75 /* Command K */) {
      set("depends_on", "");
      set("lemmas", row.depends_on);
    } else if (e.metaKey && e.keyCode === 85 /* Command U */) {
      set("lemmas", row.icelandic + "%");
    } else if (e.metaKey && e.keyCode === 73 /* Command I */) {
      set("alternative_id", row.icelandic);
      e.preventDefault();
    } else if ((e.altKey || e.metaKey) && number) {
      set("level", number);
      e.preventDefault();
    } else if (e.keyCode === 13 /* Enter */) {
      // this.formRef.current?.handleSubmit();
    } else if (e.keyCode === 27 /* Esc */) {
      selectNext(this.props.vocabularyMaker.selected);
    }
  };
  render() {
    // console.log(rows.filter((r) => !r.last_seen && !r["eyða"]));
    // if (!this.props.vocabulary.deck) return null;
    if (!this.props.vocabularyMaker.data) return null;
    return (
      <div className="vocabulary_maker">
        <div>
          {rows.filter((r) => !r.last_seen && !r["eyða"]).length} new remaining.{" "}
          {rows.filter((r) => r.last_seen && !r["eyða"] && !r.english).length}{" "}
          old need translation.
        </div>
        <h1>Voc</h1>
        <button onClick={addEmpty}>Add</button>
        <input
          placeholder="Search..."
          type="text"
          name="search"
          onKeyDown={search}
        />
        {this.props.vocabularyMaker.data.map((row, index) => {
          if (row.row_id === this.props.vocabularyMaker.selected) {
            let initialValues = row;
            row_titles.forEach((i) => (initialValues[i] = row[i] || ""));
            return (
              <Formik
                key={row.row_id}
                initialValues={initialValues}
                innerRef={this.formRef}
                enableReinitialize={true}
                validate={(values) => {
                  const errors = {};
                  if (/,/.test(values.icelandic)) {
                    errors.icelandic = "Comma not allowed";
                  }
                  if (/,/.test(values.english)) {
                    errors.english = "Comma not allowed";
                  }
                  if (!values.level && !getDeckName() && values.english) {
                    errors.level = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  // document.querySelector("[name=level]").focus();
                  submit(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div>
                      {!row["english"] &&
                        didYouMeanSuggestions(row["icelandic"], row.row_id)}
                    </div>
                    {["icelandic", "english", ...row_titles].map((row_name) => (
                      <label key={row_name} htmlFor={row_name}>
                        <b>{row_name}:</b>
                        <br />
                        <ErrorMessage
                          name={row_name}
                          component="div"
                          className="form-error"
                        />
                        <Field
                          // type={row_name === "level" ? "number" : "text"}
                          type="text"
                          autoFocus={(() => {
                            // return row_name === "level";
                            if (!row["icelandic"])
                              return row_name === "icelandic";
                            if (!row["english"]) return row_name === "english";
                            if (!row["depends_on"])
                              return row_name === "depends_on";
                            if (!row["lemmas"]) return row_name === "lemmas";
                            return row_name === "level";
                          })()}
                          name={row_name}
                          id={row_name}
                          size={
                            row[row_name] ? row[row_name].toString().length : 2
                          }
                          spellCheck={(() => {
                            if (row_name === "english") return true;
                            if (row_name === "note") return true;
                            if (row_name === "note_regarding_english")
                              return true;
                          })()}
                          lang={(() => {
                            if (row_name === "english") return "en";
                            if (row_name === "note") return "en";
                            if (row_name === "note_regarding_english")
                              return "en";
                            return "is";
                          })()}
                          onKeyUp={(e) => {
                            e.target.setAttribute(
                              "size",
                              e.target.value.toString().length || 2
                            );
                          }}
                        />

                        {/* <AutosizeTextarea
                          // className="write-textbox"
                          autoComplete="false"
                          name={row_name}
                          // value={answered ? correctAnswer : this.state.value}
                          // onKeyDown={this.checkForSubmit}
                          // onChange={this.handleChange}
                          // readOnly={answered}
                          // inputRef={(input) => {
                          //   this.textInput = input;
                          // }}
                        /> */}
                      </label>
                    ))}

                    <button
                      type="submit"
                      // disabled={isSubmitting}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className=""
                      onClick={() => ignore_for_now(row.row_id)}
                    >
                      Ignore
                    </button>
                    <button
                      type="button"
                      className="red"
                      onClick={() => delete_row(row.row_id)}
                    >
                      Delete
                    </button>
                  </Form>
                )}
              </Formik>
            );
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
}))(Form2);
