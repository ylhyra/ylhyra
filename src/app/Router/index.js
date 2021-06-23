import React, { Suspense, lazy } from "react";
import Layout from "app/Elements/Layout/Layout";
import { updateUser } from "app/User/actions";
import LoadContent from "./LoadContent";
import Frontpage from "app/Elements/Frontpage";
import components from "app/Router/paths";
import { connect } from "react-redux";
import { isBrowser } from "app/App/functions/isBrowser";
import Section from "documents/Templates/Section.js";

class App extends React.Component {
  render() {
    let Element = () => null;
    const url = this.props.route.pathname;
    if (url in components) {
      Element = components[url];
      return (
        <Layout>
          <Section>
            <Element key={url} prerender={this.props.prerender} />
          </Section>
        </Layout>
      );
    } else {
      return (
        <Layout>
          <LoadContent key={url} prerender={this.props.prerender} />
        </Layout>
      );
    }
  }
}

export default connect((state) => ({
  route: state.route,
}))(App);
