import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";
import ChapterPercentage from "ylhyra/app/vocabulary/elements/InArticles/ChapterPercentage";
import ChapterWords from "ylhyra/app/vocabulary/elements/InArticles/ChapterWords";
import { decodeDataInHtml } from "ylhyra/documents/compile/functions/functions";

class X extends Component {
  render() {
    // if (!this.props.vocabulary.deck) return null;
    const vocabulary = decodeDataInHtml(this.props.data);
    // console.log(vocabulary)
    return (
      <Link
        href={this.props.chapter_url}
        className={this.props.show_words ? "chapter" : "link-with-percentage"}
      >
        <div className="chapter-title">
          <div>{this.props.children}</div>
          {vocabulary && <ChapterPercentage data={vocabulary} />}
        </div>
        {this.props.show_words && (
          <div className="chapter-vocabulary-list">
            {vocabulary && <ChapterWords data={vocabulary} />}
          </div>
        )}
      </Link>
    );
  }
}

const connector = connect((state: RootState) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}));
export default connector(X);
