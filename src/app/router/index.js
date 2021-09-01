import React, { Suspense, lazy } from "react";
import Layout from "app/elements/layout/Layout";
import { updateUser } from "app/user/actions";
import LoadContent from "./load/Content";
import Frontpage from "app/elements/frontpage";
import components from "app/router/paths";
import { connect } from "react-redux";
import { isBrowser } from "app/app/functions/isBrowser";
import Section from "documents/templates/Section";
import { isVocabularyTheFrontpage, updateURL, index } from "app/router/actions";

class App extends React.Component {
  componentDidMount() {
    const url = this.props.url || this.props.route.pathname;
    if (url === "/" && isVocabularyTheFrontpage()) {
      updateURL("/vocabulary");
    }
  }
  render() {
    let Element = () => null;
    const url = this.props.url || this.props.route.pathname;

    if (url in components) {
      Element = components[url]; //|| components["/vocabulary"];
      let Section2 = Section;
      if (url === "/vocabulary/play") {
        Section2 = (props) => props.children;
      }
      index(false);
      return (
        <Layout>
          <Section2>
            <Element key={url} prerender={this.props.prerender} />
          </Section2>
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
