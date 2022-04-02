import React from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Layout from "ylhyra/app/elements/layout/Layout";
import { index, isVocabularyTheFrontpage } from "ylhyra/app/router/actions";
import { updateURL } from "ylhyra/app/router/actions/updateURL";
import { app_urls } from "ylhyra/app/router/appUrls";
import LoadContent from "ylhyra/app/router/Content";
import Section from "ylhyra/documents/templates/Section";

class App extends React.Component {
  componentDidMount() {
    const url = this.props.url || this.props.route.pathname;
    /* TODO: Virkar ekki ef maður er ekki loggaður inn þar sem schedule er ekki búið að initialiseras */
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
      if (url === "/vocabulary/play" || url === "/vocabulary") {
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

export default connect((state: RootState) => ({
  route: state.route,
}))(App);
