import { connect } from "react-redux";
import React, { Component } from "react";
import ChapterWords from "app/vocabulary/elements/ChapterWords";
import ChapterPercentage from "app/vocabulary/elements/ChapterPercentage";
import { DecodeDataInHTML } from "documents/compile/functions/functions";
import Link from "app/router/Link";

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
export default connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
