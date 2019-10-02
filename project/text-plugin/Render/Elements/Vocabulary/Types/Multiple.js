import React, { Component } from 'react';
import { connect } from 'react-redux';
import Answers from 'Render/Elements/Vocabulary/elements/Answers'
import Emoji from 'Render/Elements/Vocabulary/elements/emoji'
import Table from 'Render/Elements/Vocabulary/elements/table'
import clean from 'Render/Elements/Vocabulary/functions/clean'
import Prompt from 'Render/Elements/Vocabulary/Prompt'

class Element extends Component {
  render() {
    const { card, answer } = this.props
    return (
      <div>
        <Prompt card={card}/>

        <Answers answer={answer} card={card} id={this.props.id} submitAnswer={this.props.submitAnswer}>
          {card.options && card.options.map(({icelandic, english}, index) => (
            <div key={index}>
              {card.from === 'en' && (
                <div>
                  <div className="icelandic">{clean(icelandic)}</div>
                  {answer && answer.answered && card.correct_index !== index && english && (
                    <div className="english small">{clean(english)}</div>
                  )}
                </div>
              )}
              {card.from === 'is' && (
                <div>
                  <div className="english">{clean(english)}</div>
                  {answer && answer.answered && card.correct_index !== index && icelandic && (
                    <div className="icelandic small">{clean(icelandic)}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Answers>
      </div>
    )
  }
}

export default Element
