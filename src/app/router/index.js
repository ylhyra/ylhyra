import React from "react";
import Layout from "app/elements/layout/Layout";
import LoadContent from "app/router/Content";
import { app_urls } from "app/router/appUrls";
import { connect } from "react-redux";
import Section from "documents/templates/Section";
import { index, isVocabularyTheFrontpage } from "app/router/actions";
import { updateURL } from "app/router/actions/updateURL";

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

    if (url in app_urls) {
      Element = app_urls[url].component; //|| components["/vocabulary"];
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
