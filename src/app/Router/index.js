import React, { Suspense, lazy } from "react";
import Layout from "app/Elements/Layout/Layout";
import { updateUser } from "app/User/actions";
import LoadContent from "./LoadContent";
import Frontpage from "app/Elements/Frontpage";
import components from "app/Router/paths";
import { connect } from "react-redux";

class App extends React.Component {
  render() {
    let Element = () => null;
    const url = this.props.route.pathname;
    if (url in components) {
      Element = components[url];
    } else {
      Element = LoadContent;
    }

    return (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Element key={url} />
        </Suspense>
      </Layout>
    );
  }
}

export default connect((state) => ({
  route: state.route,
}))(App);
