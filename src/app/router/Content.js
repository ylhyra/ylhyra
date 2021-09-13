import React, { Component } from "react";
import NotFound from "documents/templates/404";
import { connect } from "react-redux";
import Render from "documents/render";

/**
 * Renders data loaded from server
 */
class Content extends Component {
  render() {
    if (this.props.route.data === "404") return <NotFound />;
    const parsed = this.props.route.data?.parsed || this.props.prerender;

    // TODO What if loading fails?
    if (!parsed) return <div className="small gray center">Loading...</div>;

    // import(
    //   /* webpackChunkName: "editor" */
    //   "./maker/editor/index.js"
    //   );
    return Render({ json: parsed });
  }
}
export default /*React.memo*/ connect((state) => ({
  route: state.route,
}))(Content);
