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
    if (this.props.route.data === "404") return <NotFound />;
    const parsed = this.props.route.data?.parsed || this.props.prerender;
    if (!parsed) return <div className="small gray center">Loading...</div>;
    let out;
    return Render({ json: parsed });
  }
}
export default /*React.memo*/ connect((state) => ({
  route: state.route,
}))(Content);
