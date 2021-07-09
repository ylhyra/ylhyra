import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";
import {
  load,
  select,
  submit,
  delete_row,
  selectNext,
  search,
  addEmpty,
} from "./actions";
import { formatVocabularyEntry, row_titles } from "./functions";
import VocabularyMakerRecord from "app/VocabularyMaker/record";
import AutosizeTextarea from "react-textarea-autosize";

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
    // console.log(e);
    // return;
    if (!this.props.vocabularyMaker.selected) return;
    const rows = this.props.vocabularyMaker.data;
    if (e.metaKey && e.keyCode === 75 /* K */) {
      const row =
        rows[
          rows.findIndex(
            (j) => j.row_id === this.props.vocabularyMaker.selected
          )
        ];
      // const el1 = document.querySelector("input[name=depends_on]");
      // const el2 = document.querySelector("input[name=lemmas]");
      // el2.value = el1.value;
      // el1.value = "";

      // console.log("haha");
      submit(
        {
          ...row,
          depends_on: "",
          lemmas: row.depends_on,
        },
        false
      );
    } else if (e.keyCode === 13 /* Enter */) {
      // this.formRef.current && this.formRef.current.handleSubmit();
    } else if (e.keyCode === 27 /* Esc */) {
      selectNext(this.props.vocabularyMaker.selected);
    }
  };
  render() {
    if (!this.props.vocabularyMaker.data) return null;
    return (
      <div className="vocabulary_maker">
        <h1>Voc</h1>
        <button onClick={addEmpty}>Add</button>
        <input placeholder="Search..." type="text" onKeyUp={search} />
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
                  if (!values.level) {
                    errors.level = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  submit(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {["icelandic", "english", ...row_titles].map((row_name) => (
                      <label key={row_name} htmlFor={row_name}>
                        <b>{row_name}:</b>
                        <br />
                        <ErrorMessage name={row_name} component="div" />
                        <Field
                          // type={row_name === "level" ? "number" : "text"}
                          type="text"
                          autoFocus={(() => {
                            if (!row["icelandic"])
                              return row_name === "icelandic";
                            if (!row["english"]) return row_name === "english";
                            if (!row["depends_on"])
                              return row_name === "depends_on";
                            if (!row["lemma"]) return row_name === "lemma";
                            return false;
                          })()}
                          name={row_name}
                          id={row_name}
                          size={
                            row[row_name] ? row[row_name].toString().length : 2
                          }
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
  vocabularyMaker: state.vocabularyMaker,
}))(Form2);
