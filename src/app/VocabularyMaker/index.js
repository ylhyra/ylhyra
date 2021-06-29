import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import axios from "app/App/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";

const rows = [
  // "icelandic",
  // "english",
  "depends_on",
  "level",
  "dont_confuse",
  "basic_form",
  "related_items",
  "direction",
  "note_bfr_show",
  "note_after_show",
  "note_after_show_is",
  "grammar_note f/icelandic",
  "literally",
  "should_teach",
  "categories",
  "grammar_tags",
  "importance",
  "show_hint",
  "alternative_id",
  "Laga?",
];
class Form2 extends React.Component {
  state = { data: [] };
  componentDidMount = async () => {
    let { data } = await axios.get(`/api/vocabulary_maker`, {});
    data = data
      .filter((d) => d.icelandic)
      .map((i, index) => {
        return {
          ...i,
          row_id: index + 1,
        };
      })
      .sort((a, b) => (a.level || 100) - (b.level || 100));
    this.setState({ data });
    console.log(data);
  };
  save = () => {
    axios.post(`/api/vocabulary_maker`, { data: this.state.data });
  };
  render() {
    window.save = this.save;
    return (
      <div className="vocabulary_maker">
        <h1>Voc</h1>
        {this.state.data.map((row, index) => {
          if (row.row_id === this.state.active) {
            return null;
          } else {
            return (
              <div key={row.row_id} className="row">
                <b>{row.icelandic}</b> = {row.english}
                <div className="small gray">
                  {rows.map((row_name) =>
                    row[row_name] ? (
                      <span key={row_name}>
                        <b>{row_name}:</b> {row[row_name]},{" "}
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
export default connect((state) => ({}))(Form2);
