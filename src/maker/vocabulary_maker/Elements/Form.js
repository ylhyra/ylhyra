import { connect } from "react-redux";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  delete_row,
  ignore_for_now,
  selectNext,
  submit,
} from "maker/vocabulary_maker/actions/actions";
import { getDeckName } from "maker/vocabulary_maker/compile/functions";
import {
  row_info,
  formatRowName,
  row_titles,
} from "maker/vocabulary_maker/compile/rowTitles";
import _ from "underscore";
import { didYouMeanSuggestions } from "maker/vocabulary_maker/actions/didYouMean";

class Form2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formRef = React.createRef();
    setTimeout(() => {
      window.j = this.formRef;
    }, 100);
  }
  componentDidMount = async () => {
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
  set = (name, val) => {
    this.formRef.current.setFieldValue(name, val || "");
    console.log({ name, val });
    // submit(
    //   {
    //     ...row,
    //     ...data,
    //     [name]: val,
    //   },
    //   false
    // );
  };

  checkKey = (e) => {
    if (e.altKey && e.metaKey) return;
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
    if (e.keyCode === 54) number = 6;
    if (e.metaKey && e.keyCode === 75 /* Command K */) {
      this.set("depends_on", "");
      this.set("lemmas", row.depends_on);
    } else if (e.metaKey && e.keyCode === 85 /* Command U */) {
      this.set("lemmas", row.icelandic + "%");
    } else if (e.metaKey && e.keyCode === 73 /* Command I */) {
      this.set("alternative_id", row.icelandic);
      e.preventDefault();
    } else if ((e.altKey || e.metaKey) && number) {
      this.set("level", number);
      e.preventDefault();
    } else if (e.keyCode === 13 /* Enter */) {
      // this.formRef.current?.handleSubmit();
    } else if (e.keyCode === 27 /* Esc */) {
      selectNext(this.props.vocabularyMaker.selected);
    }
  };
  render() {
    const { row } = this.props;
    const { selectedField } = this.state;
    let initialValues = row;
    row_titles.forEach((i) => (initialValues[i] = row[i] || ""));

    const shownRowTitles = _.uniq(
      [
        ...row_titles.filter((row_title) => row_info[row_title].alwaysShow),
        selectedField,
        ...row_titles.filter((row_title) => row[row_title]),
      ].filter(Boolean)
    );
    const unshownRowTitles = _.difference(row_titles, shownRowTitles);

    return (
      <Formik
        key={row.row_id}
        initialValues={initialValues}
        innerRef={this.formRef}
        enableReinitialize={true}
        validateOnChange={false}
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
        onSubmit={(values) => {
          // document.querySelector("[name=level]").focus();
          submit(values);
        }}
      >
        {() => (
          <Form>
            <div>
              {!row["english"] &&
                didYouMeanSuggestions(row["icelandic"], row.row_id)}
            </div>
            {shownRowTitles.map((row_name) => {
              const cur_row_info = row_info[row_name];
              const { options } = cur_row_info;
              return (
                <label key={row_name} htmlFor={row_name}>
                  <b>{formatRowName(row_name)}:</b>
                  <br />
                  <ErrorMessage
                    name={row_name}
                    component="div"
                    className="form-error"
                  />
                  <Field
                    // type={row_name === "level" ? "number" : "text"}
                    type="text"
                    as={options ? "select" : ""}
                    autoFocus={(() => {
                      // return row_name === "level";
                      if (selectedField) return row_name === selectedField;
                      if (!row["icelandic"]) return row_name === "icelandic";
                      if (!row["english"]) return row_name === "english";
                      if (!row["depends_on"]) return row_name === "depends_on";
                      if (!row["lemmas"]) return row_name === "lemmas";
                      return row_name === "level";
                    })()}
                    name={row_name}
                    id={row_name}
                    size={(() => {
                      // if (row_name === "level") return 1;
                      if (options) return 1; //options.length + 1;
                      // if (options) return 1;
                      return row[row_name]?.toString().length || 2;
                    })()}
                    spellCheck={(() => {
                      if (row_name === "english") return true;
                      if (row_name === "note") return true;
                      if (row_name === "note_regarding_english") return true;
                    })()}
                    lang={(() => {
                      if (row_name === "english") return "en";
                      if (row_name === "note") return "en";
                      if (row_name === "note_regarding_english") return "en";
                      return "is";
                    })()}
                    onKeyUp={(e) => {
                      if (options) return;
                      e.target.setAttribute(
                        "size",
                        e.target.value.toString().length || 2
                      );
                    }}
                  >
                    {options && [
                      <option value="" key={100}>
                        –
                      </option>,
                      options.map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.title}
                        </option>
                      )),
                    ]}
                  </Field>
                </label>
              );
            })}
            <br />
            {unshownRowTitles.map((row_name) => (
              <button
                type="button"
                className="simple-button gray-button"
                key={row_name}
                onClick={() => {
                  this.setState({
                    selectedField: row_name,
                  });
                }}
                style={{
                  margin: "1px 2px 1px 0",
                }}
              >
                {formatRowName(row_name)}
              </button>
            ))}
            <br />
            <button type="submit">Submit</button>
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
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
  vocabularyMaker: state.vocabularyMaker,
}))(Form2);
