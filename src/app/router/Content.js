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

    if (!parsed) return <Loading key={this.props.route.pathname} />;

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

class Loading extends Component {
  state = {};
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ failed: true });
    }, 2000);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    if (this.state.failed)
      return <div className="small gray center">Loading failed</div>;
    return <div className="small gray center">Loading...</div>;
  }
}
