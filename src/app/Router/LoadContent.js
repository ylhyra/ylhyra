import React, { Component } from "react";
import NotFound from "documents/Templates/404";
import { connect } from "react-redux";
import { getURL } from "app/Router/actions";
import { html2json, json2html } from "app/App/functions/html2json";
// import Parse from "documents/Parse";
import { updateURL } from "app/Router/actions";
import Render from "documents/Render";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
// import markdown_to_html from 'documents/Compile/markdown_to_html'
import { isBrowser } from "app/App/functions/isBrowser";

class Content extends Component {
  render() {
    // if (this.state.error) return <NotFound />;
    if (!this.props.route.data) return <div>Loading...</div>;
    let out;
    out = Render({
      json: this.props.route.data.parsed,
    });
    return (
      <div>
        <VocabularyHeader header_data={this.props.route.data.header} />
        {out}
      </div>
    );
  }
}
export default connect((state) => ({
  route: state.route,
}))(Content);
