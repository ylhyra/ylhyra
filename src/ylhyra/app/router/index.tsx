import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { RootState } from "ylhyra/app/app/store";
import Layout from "ylhyra/app/elements/layout/Layout";
import {
  setIndexing,
  isVocabularyTheFrontpage,
} from "ylhyra/app/router/actions";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { appUrls } from "ylhyra/app/router/appUrls";
import LoadContent from "ylhyra/app/router/Content";
import Section from "ylhyra/documents/templates/Section";

class App extends React.Component<
  ConnectedProps<typeof connector> & {
    url: string;
    prerender?: HtmlAsJson;
  }
> {
  componentDidMount() {
    const url = this.props.url || this.props.route.pathname;
    /* TODO: Virkar ekki ef maður er ekki loggaður inn þar sem schedule er ekki búið að initialiseras */
    if (url === "/" && isVocabularyTheFrontpage()) {
      goToUrl("/vocabulary");
    }
  }
  render() {
    let Element = () => null;
    const url = this.props.url || this.props.route.pathname;

    if (url in appUrls) {
      Element = appUrls[url].component; //|| components["/vocabulary"];
      let Section2 = Section;
      if (url === "/vocabulary/play" || url === "/vocabulary") {
        Section2 = (props) => props.children;
      }
      setIndexing(false);
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

const connector = connect((state: RootState) => ({
  route: state.route,
}));
export default connector(App);
