import React, { Component } from 'react';
import { connect } from 'react-redux';
import Answers from 'text-plugin/Vocabulary/elements/Answers'
import Emoji from 'text-plugin/Vocabulary/elements/emoji'
import Table from 'text-plugin/Vocabulary/elements/table'
import clean from 'text-plugin/Vocabulary/functions/clean'
import Prompt from 'text-plugin/Vocabulary/elements/Prompt'

class Element extends Component {
  render() {
    const { card, answer } = this.props
    // console.log(card)
    return (
      <div>
        <Prompt card={card}/>

        <Answers answer={answer} card={card} id={this.props.id} >
          {card.options && card.options.map(({icelandic, english}, index) => (
            <div key={index}>
              {card.from === 'en' && (
                <div>
                  <div className="icelandic">{clean(icelandic)}</div>
                  {answer.answered && card.correct_index !== index && english && (
                    <div className="english small">{clean(english)}</div>
                  )}
                </div>
              )}
              {card.from === 'is' && (
                <div>
                  <div className="english">{clean(english)}</div>
                  {answer.answered && card.correct_index !== index && icelandic && (
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
