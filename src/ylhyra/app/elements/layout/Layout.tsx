import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Error from "ylhyra/app/app/error";
import { RootState } from "ylhyra/app/app/store";
import Footer from "ylhyra/app/elements/layout/Footer";
import Header from "ylhyra/app/elements/layout/Header";

class Layout extends React.Component<
  ConnectedProps<typeof connector> & {
    children?: any;
  }
> {
  render() {
    const isFullscreen = ["/vocabulary/play"].includes(this.props.pathname);
    return (
      <div id="container">
        <Error />
        {!isFullscreen && <Header />}
        <div id="content">{this.props.children}</div>
        {!isFullscreen && <Footer />}
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  pathname: state.route.pathname,
}));
export default connector(Layout);
