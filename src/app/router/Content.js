import React, { Component } from "react";
import NotFound from "documents/templates/404";
import { connect } from "react-redux";
import Render from "documents/render";

class Content extends Component {
  render() {
    if (this.props.route.data === "404") return <NotFound />;
    const parsed = this.props.route.data?.parsed || this.props.prerender;
    if (!parsed) return <div className="small gray center">Loading...</div>;
    return Render({ json: parsed });
  }
}
export default /*React.memo*/ connect((state) => ({
  route: state.route,
}))(Content);
