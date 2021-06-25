import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import axios from "app/App/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";

const rows = [
  "icelandic",
  "english",
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
      .sort((a, b) => (a.level || 100) - (b.level || 100));
    this.setState({ data });
  };
  save = () => {
    axios.post(`/api/vocabulary_maker`, { data: this.state.data });
  };
  render() {
    window.save = this.save;
    return (
      <table className="wikitable vocabulary_maker_table">
        <tbody>
          <tr>
            {rows.map((row_name) => (
              <th key={row_name}>{row_name}</th>
            ))}
          </tr>
          {this.state.data.map((row, index) => (
            <tr key={index}>
              {rows.map((row_name) => (
                <td key={row_name}>{row[row_name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
export default connect((state) => ({}))(Form2);
