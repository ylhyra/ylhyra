import Link from "app/router/Link";
import ChapterPercentage from "app/vocabulary/elements/InArticles/ChapterPercentage";
import ChapterWords from "app/vocabulary/elements/InArticles/ChapterWords";
import { DecodeDataInHTML } from "documents/compile/functions/functions";
import React, { Component } from "react";
import { connect } from "react-redux";

class X extends Component {
  render() {
    // if (!this.props.vocabulary.deck) return null;
    const vocabulary = DecodeDataInHTML(this.props.data);
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
export default connect((state: RootState) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
