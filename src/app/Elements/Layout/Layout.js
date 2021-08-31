import Error from "app/App/Error";
import Footer from "app/Elements/Layout/Footer";
import Header from "app/Elements/Layout/Header";
import React from "react";
import { connect } from "react-redux";

class Layout extends React.Component {
  render() {
    const is_fullscreen = ["/vocabulary/play"].includes(
      this.props.route.pathname
    );
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
  route: state.route,
}))(Layout);
