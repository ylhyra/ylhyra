import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";
import { load, select, submit, delete_row } from "./actions";
import { formatVocabularyEntry } from "./functions";
import VocabularyMakerRecord from "app/VocabularyMaker/record";

const row_titles = [
  // "icelandic",
  // "english",
  "depends_on",
  "basic_form",
  "this is a minor variation of",
  "level",
  "dont_confuse",
  "related_items",
  "direction",
  "note_bfr_show",
  "note_after_show",
  "note_after_show_is",
  "grammar_note f/icelandic",
  "literally",
  // "should_teach",
  // "categories",
  // "grammar_tags",
  "importance",
  "show_hint",
  "alternative_id",
  "Laga?",
  "eyða",
];
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
      // const el2 = document.querySelector("input[name=basic_form]");
      // el2.value = el1.value;
      // el1.value = "";

      // console.log("haha");
      submit(
        {
          ...row,
          depends_on: "",
          basic_form: row.depends_on,
        },
        false
      );
    } else if (e.keyCode === 13 /* Enter */) {
      // this.formRef.current && this.formRef.current.handleSubmit();
    }
  };
  render() {
    if (!this.props.vocabularyMaker.data) return null;
    return (
      <div className="vocabulary_maker">
        <h1>Voc</h1>
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
                        <Field
                          type={row_name === "level" ? "number" : "text"}
                          autoFocus={row_name === "basic_form"}
                          name={row_name}
                          id={row_name}
                          size={row[row_name] ? row[row_name].length : 2}
                          onKeyUp={(e) => {
                            e.target.setAttribute(
                              "size",
                              e.target.value.length
                            );
                          }}
                        />
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
                className="row"
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
                        <b>{row_name}</b>: {row[row_name]},{" "}
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
