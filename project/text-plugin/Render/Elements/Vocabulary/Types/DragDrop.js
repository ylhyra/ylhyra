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
    const otherAnswers = ParseHTMLtoArray(card.other_answers).filter(Boolean).map(x => x.children)

    // console.log(correctAnswers)

    this.setState({
      options: _.shuffle([
        ...correctAnswers,
        ...otherAnswers,
      ]),
      correctAnswersText: correctAnswers.map(getText),
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
        <div className="small gray">Click the missing words in the correct order</div>
        <div className="drag-drop-prompt">
          <div className="image">{card.image}</div>
          <div className="english small gray">{card.english}</div>

          <div className="flex-center">
            <div>
              {answer.answered && card.icelandic}
              {!answer.answered && renderDropTarget(card.icelandic, answers, this.remove)}
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
  let key = 0
  const Traverse = (input) => {
    key++
    console.log(key)
    if (Array.isArray(input)) {
      return input.map(x => Traverse(x))
    } else if (typeof input === 'object' || typeof input === 'function') {
      const name = input.props['data-name']
      if (name === 'drag') {
        const text = getText(input)
        if (answers && answers.includes(text)) {
          return <span key={key} className="drag-drop-target-answered" onClick={()=>remove(text)}>
            {input}
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
