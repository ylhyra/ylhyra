import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import React, { Component, Suspense } from "react";
import { connect, ConnectedProps } from "react-redux";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { RootState } from "ylhyra/app/app/store";
import Render from "ylhyra/documents/render";
import NotFound from "ylhyra/documents/templates/404";

const RenderEditor = React.lazy(() => import("ylhyra/maker/editor"));

/**
 * Renders data loaded from server
 */
class Content extends Component<
  ConnectedProps<typeof connector> & {
    prerender?: HtmlAsJson;
  }
> {
  render() {
    if (this.props.route.is404) return <NotFound />;
    const parsed = this.props.route.data?.parsed || this.props.prerender;

    if (!parsed) return <Loading key={this.props.route.pathname} />;

    // import(
    //   /* webpackChunkName: "editor" */
    //   "./maker/editor/index.js"
    //   );
    if (isDev && isBrowser) {
      return [
        Render(parsed) || <span>Could not render</span>,
        <Suspense fallback={""} key={2}>
          <RenderEditor />
        </Suspense>,
      ];
    } else {
      return Render(parsed);
    }
  }
}
const connector = connect((state: RootState) => ({
  route: state.route,
}));
export default connector(Content);

class Loading extends Component {
  state = {
    failed: null,
  };
  timer: NodeJS.Timeout | null = null;
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
