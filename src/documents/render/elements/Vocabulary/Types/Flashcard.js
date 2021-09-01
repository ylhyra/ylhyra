import React, { Component } from "react";
import { connect } from "react-redux";
import Prompt from "documents/render/elements/Vocabulary/Prompt";
import clean from "documents/render/elements/Vocabulary/functions/clean";

class Element extends Component {
  render() {
    const { card } = this.props;
    let answer = {};
    if (
      this.props.answer &&
      this.props.cards &&
      this.props.cards[0] &&
      this.props.answer.id === this.props.cards[0].id
    ) {
      answer = this.props.answer;
    }
    return (
      <div className="flashcard-container" onClick={this.props.submitAnswer}>
        <div className="flashcard-top">
          <Prompt card={card} />
        </div>
        {!answer.answered && (
          <div className="flashcard-bottom not-answered">
            Click to show answer
          </div>
        )}
        {answer.answered && (
          <div className="flashcard-bottom">
            {card.from !== "is" && (
              <div>
                <span>{clean(card.icelandic)}</span>
                {/* <Pronunciation pronunciation={card.pronunciation} brackets/> */}
              </div>
            )}
            {card.from !== "en" && (
              <span className="english">{clean(card.english)}</span>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Element;
