import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore'
import clean from 'Render/Elements/Vocabulary/functions/clean'
import { ParseHTMLtoObject, ParseHTMLtoArray, getText } from 'Render/Elements/parse'

class Element extends Component {
  state = {}
  componentDidMount() {
    const { card } = this.props
    const correctAnswers = ParseHTMLtoArray(card.icelandic).filter(Boolean).map(x => x.children)
    const otherOptions = ParseHTMLtoArray(card.other_options).filter(Boolean).map(x => x.children)

    this.setState({
      options: _.shuffle([
        ...correctAnswers,
        ...otherOptions,
      ]),
      correctAnswers: correctAnswers.map(getText),
      answers: [],
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.card.id !== prevProps.card.id) {
      this.componentDidMount()
    }
  }
  click = (text) => {
    let answers = this.state.answers || []
    let index = answers.findIndex(i => !i)
    if (index < 0) {
      index = answers.length
    }
    answers.splice(index, 1, text)
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
      this.props.submitAnswer({
        correct,
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
        {/* <div className="top-instructions">Click the missing words in the correct order</div> */}
        <div className="drag-drop-prompt">
          <div className="english">"{card.english}"</div>
          <div className="image">{card.image}</div>

          <div className="flex-center">
            <div>
              {renderDropTarget(card.icelandic, answers, this.remove)}

              {/* {answer.answered && card.icelandic} */}
              {/* {!answer.answered && renderDropTarget(card.icelandic, answers, this.remove)} */}
            </div>
          </div>
        </div>

        <div className="drag-drop-answers">
          <div className="flex-center">
            <div>
              {options && options.map((option, index) => {
                const text = getText(option)
                if(answers&&answers.includes(text)) {
                  return null
                } else {
                  return (
                    <div key={index} className="drag-drop-object" onClick={()=>this.click(text)}>
                      {option}
                    </div>
                  )
                }
              })}
              {answer.answered && answer.correct && (<div class="green">Correct</div>)}
              {answer.answered && !answer.correct && (
                <div>
                  <div>The correct answer is:</div>
                  {card.icelandic}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Element

/*
  Renders drop targets as blank spaces unless someone has answered it
*/
const renderDropTarget = (children, answers, remove) => {
  let index = 0
  const Traverse = (input, key = 0) => {
    if (Array.isArray(input)) {
      return input.map((element, index) => Traverse(element, index))
    } else if (typeof input === 'object' || typeof input === 'function') {
      const name = input.props['data-name']
      if (name === 'drag') {
        index++
        if (answers && answers[index-1]) {
          const text = getText(input)
          return <span key={key} className="drag-drop-target-answered" onClick={()=>remove(text)}>
            {answers[index-1]}
          </span>
        } else {
          return <span key={key} className="drag-drop-target"><span/></span>
        }
      } else {
        return {
          ...input,
          props: {
            ...input.props,
            children: Traverse(input.props.children)
          }
        }
      }
    } else {
      return input
    }
  }
  return Traverse(children)
}
