import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";
import { load, select, submit } from "./actions";
import { formatVocabularyEntry } from "./functions";
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
];
class Form2 extends React.Component {
  componentDidMount = async () => {
    load();
  };
  render() {
    if (!this.props.vocabularyMaker.data) return null;
    return (
      <div className="vocabulary_maker">
        <h1>Voc</h1>
        {this.props.vocabularyMaker.data.map((row, index) => {
          if (row.row_id === this.props.vocabularyMaker.selected) {
            return (
              <Formik
                key={row.row_id}
                initialValues={row}
                // validate={(values) => {
                //   const errors = {};
                //   if (!values.username.trim()) {
                //     errors.username = "Required";
                //   }
                //   if (values.email && !/@/.test(values.email)) {
                //     errors.email = "Invalid email address";
                //   }
                //   if (!values.password) {
                //     errors.password = "Required";
                //   }
                //   return errors;
                // }}
                onSubmit={(values, { setSubmitting }) => {
                  submit(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {["icelandic", "english", ...row_titles].map((row_name) => (
                      // <span key={row_name}>
                      //   <b>{row_name}:</b> {row[row_name]},{" "}
                      // </span>
                      <label key={row_name} htmlFor={row_name}>
                        <b>{row_name}:</b>
                        <br />
                        {/* <ErrorMessage name="password" component="div" /> */}
                        <Field
                          type={row_name === "level" ? "number" : "text"}
                          name={row_name}
                        />
                      </label>
                    ))}

                    <button
                      type="submit"
                      // disabled={isSubmitting}
                    >
                      Submit
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
