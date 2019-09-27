import React, { Component } from 'react';
import { connect } from 'react-redux';
import { submitAnswer } from 'Render/Elements/Vocabulary/actions'
import store from 'App/store'
let timer

class Write extends Component {
  constructor(props) {
    super(props);
    const { card } = this.props
    let correctAnswer
    if (card.from !== 'is') {
      correctAnswer = RawText(card.icelandic)
    } else {
      correctAnswer = RawText(card.english)
    }
    this.state = {
      value: getFirstLetters(correctAnswer, card),
      correctAnswer,
    }
  }

  componentDidMount = () => {
    this.focus()
  }
  focus = () => {
    this.textInput.focus()
  }

  handleChange = (event) => {
    if (this.state.answered) return;
    this.setState({ value: event.target.value })
    this.check(event.target.value)
  }

  handleSubmit = (event) => {
    this.check(this.state.value, true)
    event.preventDefault();
  }

  check = (value, submit = false) => {
    const { card } = this.props
    const isCorrect = EqualOrSimilar(this.state.correctAnswer, value)
    // console.log({ isCorrect })
    timer && clearTimeout(timer)
    if (isCorrect === 'yes') {
      this.submit(isCorrect)
    } else if (isCorrect === 'kind of' && !submit) {
      timer = setTimeout(() => { this.submit(isCorrect) }, 800)
    } else if (submit) {
      this.submit(isCorrect)
    }
  }

  submit = (isCorrect) => {
    this.setState({
      answered: true,
      isCorrect,
    })
    submitAnswer({
      correct: isCorrect === 'yes' || isCorrect === 'kind of',
      section_id: this.props.id
    })
  }

  render() {
    const { card } = this.props
    const { correctAnswer, answered, isCorrect } = this.state
    return (
      <div className="writing-container">
        {/* {process.env.NODE_ENV !== 'production' && (
          <div className="gray"><small>{correctAnswer}</small></div>
        )} */}
        <div className="top">
          <div>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                autoComplete="false"
                className="write-textbox"
                value={answered ? correctAnswer : this.state.value}
                onChange={this.handleChange}
                readOnly={answered}
                max={correctAnswer.length + 15}
                ref={(input) => { this.textInput = input; }}
              />
            </form>

            {answered && isCorrect === 'yes' && (<div>
              <small className="correct">Correct</small>
            </div>)}

            {answered && (isCorrect === 'no' || isCorrect === 'kind of') && (<div>
              <small>
                {isCorrect === 'kind of' && <small className="correct">Correct - </small>}
                <span className="gray">Your answer:</span> <i>{this.state.value}</i></small>
            </div>)}
          </div>
        </div>

        <div className="bottom">
          <div className="small-instructions">
            {card.to === 'is' && (
              <div>If you don't have an Icelandic keyboard, you can skip the accent marks and substitue the following: þ = th, ð = d, æ = ae, ö = o.</div>
            )}
            Hit enter to submit.
          </div>
        </div>
      </div>
    )
  }
}
export default Write


const RawText = (input) => {
  if (!input) return ''
  return removeTags(input)
    .replace(/¹/g, '') // TODO!!!! HVAÐ Á AÐ GERA MEÐ ÞETTA??
}

export const removeTags = (input) => removeInvisible(input).replace(/<.*?>/g, '')
export const removeInvisible = (input) => input.replace(/<span[^>]*?display: ?none[^>]*?>[^<>]*?<\/span>/g, '')
export const removeRepeatingCharacters = (input) => input.replace(/(.)\1+/g, (str, match) => match[0])

export const EqualOrSimilar = (correctAnswer, userAnswer) => {
  /*
    Ignore uppercase and spaces
  */
  correctAnswer = correctAnswer.toLowerCase().replace(/\s+/g, ' ').replace(/[?!:,.]/g, '').trim()
  userAnswer = userAnswer.toLowerCase().replace(/\s+/g, ' ').replace(/[?!:,.]/g, '').trim()

  /*
    Correct
  */
  if (userAnswer === correctAnswer) {
    return 'yes'
  }

  /*
    Trim "mig" from "mig langar" // TEMP
  */
  correctAnswer = ignoreAtStart(correctAnswer)
  userAnswer = ignoreAtStart(userAnswer)
  // console.log({ correctAnswer, userAnswer })
  /*
    Correct without special characters
  */
  userAnswer = userAnswer
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ö/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, 'd')
    .replace(/þ/g, 'th')
  correctAnswer = correctAnswer
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ö/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, '(d|dh|th)')
    .replace(/þ/g, '(d|dh|th|t)')
  if ((new RegExp('^' + correctAnswer + '$', 'i')).test(userAnswer)) {
    return 'kind of'
  }

  /*
    Correct except for:
    - special characters
    - repeating characters
    - y/i, ý/í
  */
  userAnswer = removeRepeatingCharacters(userAnswer).replace(/y/g, 'i')
  correctAnswer = removeRepeatingCharacters(correctAnswer).replace(/y/g, 'i')
  if ((new RegExp('^' + correctAnswer + '$', 'i')).test(userAnswer)) {
    return 'kind of'
  }
  return 'no'
}

/*
  Ignores "mig" in "mig langar"
*/
const ignoreAtStart = (input) => {
  return input.replace(ignoreRegex, '').trim()
}
const ignoreRegex = /^((?:you guys|ég|mig|mér|mín|þú|þig|þér|þín|hann|honum|hans|þeir|við|okkur|þið|ykkur|hún|hana|henni|hennar|það|því|þess|þá|þeim|þeirra|þær|þau|I|you|he|she|it|we|us|him|his|her|its|að|to|they|them) )/i

const getFirstLetters = (input, card) => {
  if (card.hint) {
    // return input.split(ignoreRegex).map((text, index) => {
    // if (index === 1) {
    //   return text
    // }
    const text = input
    if (typeof card.hint === 'number') {
      return text.slice(0, card.hint)
    } else if (text.length === 1) {
      return ''
    } else if (text.length === 2) {
      return text.slice(0, 1)
    } else {
      const length = Math.random() > 0.5 ? 2 : 1
      return text.slice(0, length)
    }
    // console.log({ text, index })
    // }).join('')
  } else {
    return ''
  }
}
