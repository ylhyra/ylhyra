import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";
import axios from "app/App/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import errors from "app/App/Error/messages";

class Form2 extends React.Component {
  state = { data: [] };
  componentDidMount = async () => {
    const { data } = await axios.get(`/api/vocabulary_maker`, {});
    this.setState({ data });
  };

  render() {
    return (
      <table className="wikitable">
        <tbody>
          {this.state.data.map((row, index) => (
            <tr key={index}>
              <td>{row["icelandic"]}</td>
              <td>{row["english"]}</td>
              <td>{row["depends_on"]}</td>
              <td>{row["level"]}</td>
              <td>{row["dont_confuse"]}</td>
              <td>{row["basic_form"]}</td>
              <td>{row["related_items"]}</td>
              <td>{row["direction"]}</td>
              <td>{row["note_bfr_show"]}</td>
              <td>{row["note_after_show"]}</td>
              <td>{row["note_after_show_is"]}</td>
              <td>{row["grammar_note f/icelandic"]}</td>
              <td>{row["literally"]}</td>
              <td>{row["should_teach"]}</td>
              <td>{row["categories"]}</td>
              <td>{row["grammar_tags"]}</td>
              <td>{row["importance"]}</td>
              <td>{row["show_hint"]}</td>
              <td>{row["alternative_id"]}</td>
              <td>{row["Laga?"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
export default connect((state) => ({}))(Form2);
