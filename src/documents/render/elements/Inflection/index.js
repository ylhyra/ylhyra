import React from "react";
import { connect } from "react-redux";
// import { ParseHTMLtoObject } from 'documents/Render/Elements/parse'
// import Word from './word'
// import { without } from 'underscore'
// import link from './link'
import { ShowInflectionTable } from "documents/render/elements/Inflection/actions";

class Inflection extends React.Component {
  // state = {
  //   small: true
  // }
  componentDidMount = () => {
    if (process.env.NODE_ENV === "production") return; // TEMP!

    /* Inflectional search engine */
    if (!this.props.inflection.rows) {
      if (mw.config.get("wgPageName") !== "Inflection") return;
      const id = mw.util.getParamValue("id");
      id && ShowInflectionTable({ BIN_id: id });
      this.setState({
        small: false,
      });
    }
  };
  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.inflection }} />;
  }
}

export default connect((state) => ({
  inflection: state.inflection,
}))(Inflection);