import React, { Component } from "react";
import { connect } from "react-redux";
import Answers from "documents/Render/Elements/Vocabulary/elements/Answers";
import Emoji from "documents/Render/Elements/Vocabulary/elements/emoji";
import Table from "documents/Render/Elements/Vocabulary/elements/table";
import clean from "documents/Render/Elements/Vocabulary/functions/clean";
import Prompt from "documents/Render/Elements/Vocabulary/Prompt";

class Element extends Component {
  render() {
    const { card, answer } = this.props;
    return (
      <div>
        <Prompt card={card} answer={answer} />

        <Answers
          answer={answer}
          card={card}
          id={this.props.id}
          submitAnswer={this.props.submitAnswer}
        >
          {card.options &&
            card.options
              .filter(Boolean)
              .map(({ icelandic, english }, index) => (
                <div key={index}>
                  {card.to === "is" && (
                    <div>
                      <div className="icelandic">{clean(icelandic)}</div>
                      {answer &&
                        answer.answered &&
                        card.correct_index !== index &&
                        english && (
                          <div className="english small">{clean(english)}</div>
                        )}
                    </div>
                  )}
                  {card.to === "en" && (
                    <div>
                      <div className="english">{clean(english)}</div>
                      {answer &&
                        answer.answered &&
                        card.correct_index !== index &&
                        icelandic && (
                          <div className="icelandic small">
                            {clean(icelandic)}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
        </Answers>
      </div>
    );
  }
}

export default Element;
