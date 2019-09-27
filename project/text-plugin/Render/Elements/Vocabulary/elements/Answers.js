import React, { Component } from 'react';
import { submitAnswer } from 'Render/Elements/Vocabulary/actions'

class Answers extends Component {
  render() {
    const { children, vertical, answer, card } = this.props
    const direction = vertical ? 'vertical' : 'horizontal'
    return (
      <div className={`answers ${direction}`}>
        {children && children.map((choice, index) => {

          const isThisTheCorrectAnswer = index === card.correct_index

          const className = [
            'button-answer',
            direction,
            answer.answered && 'answered',
            answer.selected_index === index && 'selected',
            answer.answered && isThisTheCorrectAnswer ? 'correct' : 'incorrect'
          ].filter(Boolean).join(' ')

          return (
            <div className={className} key={index} onClick={()=>submitAnswer({
              index,
              correct: isThisTheCorrectAnswer,
              section_id: this.props.id,
             }) }>
              {choice}
            </div>
        )})}
      </div>
    )
  }
}

export default Answers
