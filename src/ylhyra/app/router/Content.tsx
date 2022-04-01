import { RootState } from "ylhyra/app/app/store";
import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import Render from "ylhyra/documents/render";
import NotFound from "ylhyra/documents/templates/404";
import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

const RenderEditor = React.lazy(() => import("ylhyra/maker/editor"));

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
    if (isDev && isBrowser) {
      return [
        Render(parsed),
        <Suspense fallback={""} key={2}>
          <RenderEditor />
        </Suspense>,
      ];
    } else {
      return Render(parsed);
    }
  }
}
export default /*React.memo*/ connect((state: RootState) => ({
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
