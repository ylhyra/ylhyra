/*
  When preparing a student for the next card.
  No game, just showing a word.
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Prompt from 'Render/Elements/Vocabulary/Prompt'
import clean from 'Render/Elements/Vocabulary/functions/clean'

class Element extends Component {
  render() {
    const { card } = this.props
    return (
      <div className="flashcard-container" /* onClick={this.props.submitAnswer}*/>
        <div className="prompt-word flex-center">
          <div>{clean(card.icelandic)}</div>
          <div className="english small">{clean(card.english)}</div>
        </div>

      </div>
    )
  }
}

export default Element
