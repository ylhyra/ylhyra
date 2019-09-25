import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore'
import clean from 'text-plugin/Vocabulary/functions/clean'
import { submitAnswer } from 'text-plugin/Vocabulary/actions'

class Element extends Component {
  state = {}
  componentDidMount() {
    const correctAnswers = this.props.card.icelandic.split(/\[(.*?)\]/g).map((part, index) => {
      if (index % 2 !== 0) {
        return part
      } else {
        return null
      }
    }).filter(Boolean)

    this.setState({
      options: _.shuffle(this.props.card.options),
      correctAnswers,
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.card.id !== prevProps.card.id) {
      this.componentDidMount()
    }
  }
  click = (value) => {
    let answers = this.state.answers || []
    let index = answers.findIndex(i => !i)
    if (index < 0) {
      index = answers.length
    }
    answers.splice(index, 1, value)
    answers = answers.slice(0, this.state.correctAnswers.length) // Don't overflow allowed slots
    this.setState({ answers })

    let allAnswered = true
    let correct = true
    this.state.correctAnswers.forEach((answer, i) => {
      if (answer !== answers[i]) {
        correct = false
      }
      if (!answers[i]) {
        allAnswered = false
      }
    })
    if (allAnswered) {
      submitAnswer({
        correct,
        section_id: this.props.id
      })
    }
  }
  remove = (index) => {
    let answers = this.state.answers || []
    answers[index] = null
    this.setState({
      answers: answers
    })
  }
  render() {
    const { card, answer } = this.props
    const { options, answers } = this.state
    return (
      <div>
        <div className="drag-drop-prompt">
          <div className="english small gray">{card.english}</div>

          <div className="flex-center">
            <div>
              {answer.answered && card.icelandic.replace(/[[\]]/g,'')}
              {!answer.answered && card.icelandic.split(/\[(.*?)\]/g).map((part,index) => {
                if (index % 2 !== 0) {
                  const i = Math.floor(index/2)
                  if(answers && answers[i]) {
                    return (
                      <span key={index} className="drag-drop-target-answered" onClick={()=>this.remove(i)}>
                        {answers[i]}
                      </span>
                    )
                  } else {
                    return <span key={index} className="drag-drop-target"><span/></span>
                  }
                } else {
                  return part
                }
              })}
            </div>
          </div>
        </div>

        <div className="drag-drop-answers">
          <div className="flex-center">
            <div>
              {options && options.map(({icelandic, english}, index) => {
                if(answers&&answers.includes(icelandic)) {
                  return null
                } else {
                  return (
                    <div key={index} className="drag-drop-object" onClick={()=>this.click(icelandic)}>
                      {icelandic}
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Element
