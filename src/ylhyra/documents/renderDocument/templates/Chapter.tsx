import React, { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";
import ChapterPercentage from "ylhyra/vocabulary/app/elements/InArticles/ChapterPercentage";
import ChapterWords from "ylhyra/vocabulary/app/elements/InArticles/ChapterWords";
import { decodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";

class X extends Component<
  ConnectedProps<typeof connector> & {
    data: string;
    chapterUrl: string;
    showWords: Boolean;
  }
> {
  render() {
    // if (!this.props.vocabulary.deck) return null;
    const vocabulary = decodeDataInHtml(this.props.data);
    // console.log(vocabulary)
    return (
      <Link
        href={this.props.chapterUrl}
        className={this.props.showWords ? "chapter" : "link-with-percentage"}
      >
        <div className="chapter-title">
          <div>{this.props.children}</div>
          {vocabulary && <ChapterPercentage data={vocabulary} />}
        </div>
        {this.props.showWords && (
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
