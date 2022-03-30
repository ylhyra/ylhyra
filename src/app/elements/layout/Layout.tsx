import Error from "app/app/error";
import Footer from "app/elements/layout/Footer";
import Header from "app/elements/layout/Header";
import React from "react";
import { connect } from "react-redux";

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
export default connect((state) => ({
  pathname: state.route.pathname,
}))(Layout);
