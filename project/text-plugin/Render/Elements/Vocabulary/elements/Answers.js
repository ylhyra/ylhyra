import React, { Component } from 'react';

class Answers extends Component {
  render() {
    const { children, vertical, answer, card, submitAnswer} = this.props
    const direction = vertical ? 'vertical' : 'horizontal'
    return (
      <div className={`answers ${direction}`}>
        {children && children.map((choice, index) => {

          const isThisTheCorrectAnswer = index === card.correct_index

          const className = [
            'button-answer',
            direction,
            answer && answer.answered && 'answered',
            answer && answer.selected_index === index && 'selected',
            answer && answer.answered && isThisTheCorrectAnswer ? 'correct' : 'incorrect'
          ].filter(Boolean).join(' ')

          return (
            <div className={className} key={index} onClick={()=>submitAnswer({
              index,
              correct: isThisTheCorrectAnswer,
             }) }>
              {choice}
            </div>
        )})}
      </div>
    )
  }
}

export default Answers
