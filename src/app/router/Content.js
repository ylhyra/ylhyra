import React, { Component, Suspense, useEffect } from "react";
import NotFound from "documents/templates/404";
import { connect } from "react-redux";
import Render from "documents/render";
import { isDev } from "app/app/functions/isDev";
import { isBrowser } from "app/app/functions/isBrowser";
import { fix_inline_translations } from "documents/read/inline_translations/InlineTranslations";

const RenderEditor = React.lazy(() => import("maker/editor"));

/**
 * Renders data loaded from server
 */
const Content = ({prerender, route}) => {
    if (route.data === "404") return <NotFound />;
    const parsed = route.data?.parsed || prerender;

    if (!parsed) return <Loading key={route.pathname} />;

    useEffect(()=>{
      fix_inline_translations();
    })

    // import(
    //   /* webpackChunkName: "editor" */
    //   "./maker/editor/index.js"
    //   );
    if (isDev && isBrowser) {
      return [
        Render({ json: parsed }),
        <Suspense fallback={""} key={2}>
          <RenderEditor />
        </Suspense>,
      ];
    } else {
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
