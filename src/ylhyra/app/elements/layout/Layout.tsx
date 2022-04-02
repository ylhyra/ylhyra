import React from "react";
import { connect } from "react-redux";
import Error from "ylhyra/app/app/error";
import { RootState } from "ylhyra/app/app/store";
import Footer from "ylhyra/app/elements/layout/Footer";
import Header from "ylhyra/app/elements/layout/Header";

class Layout extends React.Component {
  render() {
    const is_fullscreen = ["/vocabulary/play"].includes(this.props.pathname);
    return (
      <div id="container">
        <Error />
        {!is_fullscreen && <Header />}
        <div id="content">{this.props.children}</div>
        {!is_fullscreen && <Footer />}
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  pathname: state.route.pathname,
}));
export default connector(Layout);
